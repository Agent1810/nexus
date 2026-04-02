/* 
 * Mock Razorpay Integration
 * In a real-world scenario, you would first call your backend (e.g. Supabase Edge Function)
 * to generate a `razorpay_order_id` using your RAZORPAY_SECRET_KEY.
 * Then you would pass that ID to the client-side checkout.js options.
 */

const RAZORPAY_KEY_ID = 'rzp_test_SYiTmvFL846317'; // Replace with your actual Test key

const handlePayment = async (totalAmount, customerDetails, cartItems) => {
    // 1. (Mock) Call Backend to Create Order
    window.App.showToast("Initiating secure payment...");

    // Simulate backend latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockRazorpayOrderId = 'order_' + Math.random().toString(36).substr(2, 9);

    // 2. Configure Razorpay Options
    const options = {
        key: RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: Math.round(totalAmount * 100), // Amount is in currency subunits. 1 USD = 100 cents.
        currency: "USD",
        name: "Nexus Premium Tech",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        // order_id: mockRazorpayOrderId,
        handler: async function (response) {
            // This is called on successful payment
            const paymentId = response.razorpay_payment_id;

            window.App.showToast(`Payment successful! ID: ${paymentId}`);

            // 3. Save order to Supabase
            const orderPayload = [{
                user_id: window.App.AppState.user?.id || 'guest',
                total_amount: totalAmount,
                status: 'paid',
                razorpay_payment_id: paymentId,
                items: cartItems
            }];

            const { data, error } = await window.supabase.from('orders').insert(orderPayload);

            if (!error) {
                // Clear cart
                window.App.AppState.cart = [];
                window.App.saveCart();

                // Redirect or show success UI
                setTimeout(() => {
                    alert("Order confirmed! Your items will be shipped soon.");
                    window.location.href = "index.html";
                }, 1000);
            }
        },
        prefill: {
            name: customerDetails.name,
            email: customerDetails.email,
        },
        theme: {
            color: "#8b5cf6" // Match our brand accent primary
        }
    };

    // If we're just completely mocked and Razorpay SDK fails to load or we want to bipass actual UI:
    if (typeof window.Razorpay !== 'undefined') {
        try {
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                window.App.showToast(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();
        } catch (e) {
            console.error("Razorpay SDK Error", e);
            fallbackMockPayment(options.handler);
        }
    } else {
        fallbackMockPayment(options.handler);
    }
};

const fallbackMockPayment = (handler) => {
    // If the Razorpay script isn't valid or we are purely mocking offline
    const confirmPay = confirm(`MOCK PAYMENT: Proceed to pay ${window.App.formatCurrency(window.App.AppState.cart.reduce((s, i) => s + (i.price * i.quantity), 0))}?`);
    if (confirmPay) {
        handler({ razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substr(2, 9) });
    }
};
