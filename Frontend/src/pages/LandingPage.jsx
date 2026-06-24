import { GiHouseKeys } from "react-icons/gi";
import { IoShieldCheckmarkOutline, IoLockClosedOutline, IoNotificationsOutline } from "react-icons/io5";
import { BsChatDots, BsPeople, BsCheckAll } from "react-icons/bs";
import { GoZap } from "react-icons/go";
import { MdOutlineDeliveryDining, MdInstallMobile } from "react-icons/md";
import { HiOutlineStatusOnline, HiOutlineWifi } from "react-icons/hi";
import { FaAndroid, FaChrome } from "react-icons/fa";


export const LandingPage = () => {
    return (
        <>
            {/* Navbar */}
            <nav className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md border-white/40 border-b">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 h-16 flex items-center justify-between">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                            Chat<span className="text-orange-400">Hub</span>
                        </span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <a href="/login"
                            className="text-sm font-medium text-gray-700 hover:text-orange-400 transition" >
                            Login
                        </a>
                        <a href="/signup" className="bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                            Get Started
                        </a>
                    </div>

                </div>
            </nav>

            <div className="w-full bg-gray-50 text-gray-900 overflow-x-hidden">

                {/* Hero  */}
                <section className="min-h-screen flex items-center px-6 lg:px-20">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left content */}
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                Private. Real-time. <br />
                                <span className="text-orange-400">Secure Chat.</span>
                            </h1>

                            <p className="mt-6 text-gray-600 text-lg max-w-xl">
                                ChatHub is a real-time chat application with end-to-end encryption,
                                built for privacy, speed, and modern user experience.
                            </p>

                            <div className="mt-8 flex gap-4">
                                <button className="bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
                                    Get Started
                                </button>
                                <button className="border border-gray-300 px-6 py-3 rounded-xl">
                                    Live Demo
                                </button>
                            </div>
                        </div>

                        {/* Right visual */}
                        <div className="relative">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl" />
                            <img
                                src="/image.png"
                                alt="ChatHub UI"
                                className="relative z-10 rounded-2xl shadow-2xl"
                            />
                        </div>

                    </div>
                </section>


                {/* Everything you Expect  */}
                <section className="py-24 px-6 lg:px-20 bg-white">
                    <div className="max-w-7xl mx-auto">

                        {/* Heading */}
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Everything You Expect From a Modern Chat App
                            </h2>
                            <p className="text-gray-600">
                                Built with real-time performance, privacy, and usability in mind.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

                            {[
                                {
                                    title: "Real-time messaging",
                                    desc: "Instant message delivery with typing indicators."
                                },
                                {
                                    title: "End-to-end encryption",
                                    desc: "Client-side AES + RSA encryption for secure chats."
                                },
                                {
                                    title: "Group chats & friends",
                                    desc: "Create groups, manage members, and chat together."
                                },
                                {
                                    title: "Media & emoji sharing",
                                    desc: "Send images, files, and expressive emojis."
                                },
                                {
                                    title: "Read & delivery receipts",
                                    desc: "Know when messages are delivered and seen."
                                },
                                {
                                    title: "Online status & profiles",
                                    desc: "See who’s online and customize your profile."
                                }
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="
            group p-6 rounded-2xl border border-gray-200
            hover:border-orange-400 hover:shadow-lg
            transition-all duration-300
          "
                                >
                                    {/* Icon placeholder */}
                                    <div className="
            w-12 h-12 mb-4 rounded-xl
            bg-orange-400/10 text-orange-400
            flex items-center justify-center
            group-hover:bg-orange-400 group-hover:text-white
            transition
          ">
                                        {/* Replace later with icon */}
                                        <span className="font-bold text-lg">
                                            {i + 1}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </div>
                </section>


                {/* Core chat Exprerience  */}
                <section className="py-28 px-6 lg:px-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left */}
                        <div>
                            <span className="text-orange-400 font-medium mb-3 inline-block">
                                Core Experience
                            </span>

                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                Real-Time Chat That Feels Instant
                            </h2>

                            <p className="text-gray-600 mb-10 max-w-xl">
                                Powered by Socket.io, ChatHub delivers instant messaging,
                                smooth group conversations, and real-time presence updates.
                            </p>

                            <div className="space-y-6">
                                <FeatureItem
                                    icon={<GoZap />}
                                    title="Instant real-time messaging"
                                    desc="Messages are delivered instantly without refresh."
                                />
                                <FeatureItem
                                    icon={<BsPeople />}
                                    title="Group chats & friends"
                                    desc="Create groups, add friends, and manage conversations."
                                />
                                <FeatureItem
                                    icon={<BsChatDots />}
                                    title="Online & typing indicators"
                                    desc="See who’s online and typing in real time."
                                />
                            </div>
                        </div>

                        {/* Right */}
                        <div>
                            <img className="w-full h-full rounded-3xl p-4" src="/chatting.svg" alt="" />
                        </div>
                    </div>
                </section>


                {/* Smart Messaging  */}

                <section className="py-28 px-6 lg:px-20 bg-white">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left Image */}
                        <div>

                            <img
                                src="/smartmsg.svg"
                                alt="Read receipts and delivery status"
                                className="w-full h-full p-15"
                            />
                        </div>

                        {/* Right Content */}
                        <div>
                            <span className="text-orange-400 font-medium mb-3 inline-block">
                                Messaging Intelligence
                            </span>

                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                Smarter Messaging Experience
                            </h2>

                            <p className="text-gray-600 mb-10 max-w-xl">
                                Know exactly what’s happening with your messages —
                                delivered, read, or still pending.
                            </p>

                            <div className="grid gap-6">
                                <FeatureItem
                                    icon={<MdOutlineDeliveryDining />}
                                    title="Delivery status"
                                    desc="Instant feedback when messages reach recipients."
                                />
                                <FeatureItem
                                    icon={<BsCheckAll />}
                                    title="Read receipts"
                                    desc="See when your messages are read."
                                />
                                <FeatureItem
                                    icon={<HiOutlineStatusOnline />}
                                    title="Online presence"
                                    desc="Know who’s available before you message."
                                />
                            </div>
                        </div>
                    </div>
                </section>



                {/* End to End Encryption  */}
                <section className="relative py-28 px-6 lg:px-20 bg-gray-50 overflow-hidden">
                    {/* subtle accent */}
                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />

                    <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left */}
                        <div>
                            <span className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium bg-orange-400/10 text-orange-500">
                                Security & Privacy
                            </span>

                            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight text-gray-900">
                                End-to-End Encrypted by Design
                            </h2>

                            <p className="text-gray-600 mb-10 max-w-xl">
                                Messages are encrypted on the client using hybrid AES + RSA
                                encryption. Servers never see plaintext.
                            </p>

                            <div className="grid gap-6">
                                <SecurityItem
                                    icon={<IoLockClosedOutline />}
                                    title="Client-side encryption"
                                    desc="Encryption happens before messages leave your device."
                                />
                                <SecurityItem
                                    icon={<GiHouseKeys />}
                                    title="Secure key exchange"
                                    desc="RSA is used to safely exchange encryption keys."
                                />
                                <SecurityItem
                                    icon={<IoShieldCheckmarkOutline />}
                                    title="Zero plaintext storage"
                                    desc="Messages are never stored in readable form."
                                />
                            </div>
                        </div>

                        {/* Right image */}
                        <div className="p-15">
                            <img
                                src="endtoend.svg"
                                alt="End-to-end encryption flow"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </section>


                {/* Pwa  */}
                <section className="py-20 px-4 lg:px-20 bg-white">
                    <div className="max-w-7xl mx-auto">

                        {/* Top */}
                        <div className="flex flex-col items-center text-center mb-20">
                            <div className="w-20 h-20 rounded-2xl bg-orange-400/20 text-orange-400 flex items-center justify-center text-4xl mb-6">
                                <MdInstallMobile />
                            </div>

                            <h2 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-4">
                                Install ChatHub as an App
                            </h2>

                            <p className="text-gray-600 max-w-2xl">
                                ChatHub works like a native app with offline access,
                                push notifications, and fast startup using PWA technology.
                            </p>
                        </div>

                        {/* Feature cards */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <PwaCard
                                icon={<FaChrome />}
                                title="Install from Browser"
                                desc="Install directly from Chrome, Edge, or Safari."
                            />
                            <PwaCard
                                icon={<IoNotificationsOutline />}
                                title="Push Notifications"
                                desc="Receive instant notifications for new messages."
                            />
                            <PwaCard
                                icon={<HiOutlineWifi />}
                                title="Offline Access"
                                desc="View recent chats even without internet."
                            />
                        </div>

                        {/* Install buttons */}
                        <div className="flex justify-center gap-4">
                            <a
                                href="#install"
                                className="bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 flex items-center gap-2"
                            >
                                <FaChrome />
                                Install on Desktop
                            </a>

                            <a
                                href="#install-mobile"
                                className="border border-gray-300 text-gray-900 bg-gray-50 px-6 py-3 rounded-xl flex items-center gap-2"
                            >
                                <FaAndroid />
                                Install on Mobile
                            </a>
                        </div>

                    </div>
                </section>

                <footer className="bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20">

                        {/* CTA block */}
                        <div className="bg-white rounded-3xl shadow-sm p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">

                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                    Ready to Chat Securely?
                                </h2>
                                <p className="text-gray-600 max-w-xl">
                                    Open-source, real-time messaging with privacy-first design.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <a
                                    href="/signup"
                                    className="bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90"
                                >
                                    Create Free Account
                                </a>
                                <a
                                    href="/login"
                                    className="border border-gray-300 px-6 py-3 rounded-xl text-gray-700"
                                >
                                    Login
                                </a>
                            </div>

                        </div>
                        {/* Bottom bar */}
                        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-500">
                            <span>© {new Date().getFullYear()} ChatHub. All rights reserved.</span>
                            <span>Built with MERN + Socket.io</span>
                        </div>

                    </div>
                </footer>


            </div >
        </>
    )
}


const PwaCard = ({ icon, title, desc }) => (
    <div className="bg-gray-50 rounded-2xl p-6 border transition-all duration-300 hover:border-orange-400 text-center border-gray-300 ">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-400/10 text-orange-400 flex items-center justify-center text-2xl">
            {icon}
        </div>
        <h4 className="font-semibold mb-2 text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
    </div>
);

const SecurityItem = ({ icon, title, desc }) => (
    <div className="flex gap-4">
        <div className="w-11 h-11 rounded-xl bg-orange-400/10 text-orange-500 flex items-center justify-center text-xl">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{desc}</p>
        </div>
    </div>
);
const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex gap-4">
        <div className="w-11 h-11 rounded-xl bg-orange-400/10 text-orange-400 flex items-center justify-center text-xl">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-gray-600">{desc}</p>
        </div>
    </div>
);
