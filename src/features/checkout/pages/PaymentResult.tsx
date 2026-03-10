import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");
    const success = searchParams.get("success");

    const isSuccess = success === "true";

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center space-y-6">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    <span className="text-4xl">{isSuccess ? '✓' : '✕'}</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                    </h1>
                    {isSuccess ? (
                        <p className="text-gray-500 text-sm">
                            Đơn hàng của bạn đã được thanh toán thành công.
                            <br />
                            Mã đơn hàng: <span className="font-semibold text-gray-900">{orderId}</span>
                        </p>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            Rất tiếc, quá trình thanh toán đã bị hủy hoặc xảy ra lỗi. Vui lòng thử lại.
                        </p>
                    )}
                </div>

                <div className="pt-4 space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors"
                    >
                        Tiếp tục mua sắm
                    </button>
                    {!isSuccess && (
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors"
                        >
                            Quay lại giỏ hàng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}