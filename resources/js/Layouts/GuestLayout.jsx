import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import "../../css/index.css";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen relative">
            <Header />
            <div className="w-full guest-layout guestLayout">
                {children}
            </div>
            <Footer />
        </div>
    );
}
