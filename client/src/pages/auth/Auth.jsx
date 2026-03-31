
import { Eye, EyeOff, UserRound, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const credentials = [
    { role: "Super Admin", badge: "super_admin", badgeClass: "super_admin", user: "super_admin", pass: "super_admin@123456" },
    { role: "DC Operator", badge: "dc_operator", badgeClass: "dc_operator", user: "dc_operator", pass: "dc_operator@123456" },
];


function EyeIcon({ show }) {
    return show ? (
        <Eye className="text-gray-400" size={20} />
    ) : (
        <EyeOff className="text-gray-400" size={20} />
    );
}




export default function Auth() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);

    const handleUse = (cred) => {
        setUsername(cred.user);
        setPassword(cred.pass);
    };

    function handleSignIn(){
        console.log(username);
        if(username === 'super_admin'){
            navigate('/admin', {replace: true})
        }else{
            navigate('/dc', {replace: true})
        }
        
}
    return (
        <>
       

            {/* Root */}
            <div
                className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-6"
                style={{ background: "#5c1a2e" }}
            >
                {/* Background orbs */}
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 480, height: 480, background: "#c0395a", filter: "blur(90px)", opacity: 0.18, top: -120, left: -80 }}
                />
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 360, height: 360, background: "#8b1a30", filter: "blur(90px)", opacity: 0.18, bottom: -60, right: -60 }}
                />
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 220, height: 220, background: "#e8506a", filter: "blur(90px)", opacity: 0.18, top: "40%", left: "60%" }}
                />

                {/* Brand */}
                <div className="flex flex-col items-center gap-2.5 mb-7 animate-fade-down">
                    <div
                        className="w-14 h-14 flex items-center justify-center rounded-2xl text-[22px] font-semibold text-[#5c1a2e]"
                        style={{

                            background: "linear-gradient(145deg, #f5a623, #e8903a)",
                            boxShadow: "0 8px 24px rgba(245,166,35,0.35), 0 2px 8px rgba(0,0,0,0.2)",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        I
                    </div>
                    <span
                        className="text-white text-[22px] font-semibold tracking-wide"

                    >
                        Iravya
                    </span>
                    
                </div>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl w-full max-w-[420px] animate-fade-up p-6 lg:p-8"
                   
                >
                    {/* Heading */}
                    <h1
                        className="text-[24px] font-semibold text-[#1a1a2e] text-center mb-1.5"

                    >
                        Sign In
                    </h1>
                    <p className="text-[13.5px] text-[#7a7a8a] text-center mb-7 font-normal">
                        Enter your credentials to continue
                    </p>

                    {/* Username */}
                    <div className="relative mb-3.5">
                        <UserRound className="absolute left-3.5 top-1/3 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            className="input-field w-full pl-10 pr-10 py-3 border border-[#e8e8f0] rounded-[10px] text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </div>

                    {/* Password */}
                    <div className="relative mb-3.5">
                        <Lock className="absolute left-3.5 top-1/3 text-gray-400" size={16} />
                        <input
                            type={showPw ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            className="input-field w-full pl-10 pr-10 py-3 border border-[#e8e8f0] rounded-[10px] text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            tabIndex={-1}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#b0b0c0] hover:text-[#8b1a30] transition-colors duration-150 bg-transparent border-none cursor-pointer p-0"
                        >
                            <EyeIcon show={showPw} size={16}/>
                        </button>
                    </div>

                    {/* Sign In button */}
                    <button
                        type="button"
                        className="btn-signin w-full py-3.5 text-white text-[15px] font-semibold rounded-[10px] mt-1.5 tracking-wide cursor-pointer border-none transition-all duration-150"
                        onClick={handleSignIn}
                        style={{
                            background: "linear-gradient(135deg, #8b1a30, #6b1223)",
                            boxShadow: "0 4px 18px rgba(139,26,48,0.32)",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Sign In
                    </button>

                    {/* Links */}
                    {/* <div className="flex flex-col items-center gap-1.5 mt-5">
                    <span className="text-[13px] text-[#8e8e97]">
                    Customer?{" "}
                    <a
                        href="#"
                        className="link-action font-semibold cursor-pointer transition-colors duration-150 no-underline"
                        style={{ color: "#8b1a30" }}
                    >
                        Submit a request →
                    </a>
                    </span>
                    <a
                    href="#"
                    className="link-action text-[13px] font-semibold no-underline cursor-pointer transition-colors duration-150"
                    style={{ color: "#8b1a30" }}
                    >
                    <Search />Track ticket →
                    </a>
                </div> */}

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#e8e8f0]" />
                        <span className="text-[10.5px] font-semibold tracking-[2px] uppercase text-[#b0b0c0]">
                            Default Credentials
                        </span>
                        <div className="flex-1 h-px bg-[#e8e8f0]" />
                    </div>

                    {/* Credential cards */}
                    {credentials.map((cred) => (
                        <div
                            key={cred.role}
                            className="cred-card flex items-center justify-between bg-[#f7f7fb] border border-[#ececf5] rounded-[10px] px-3.5 py-3 mb-2.5 transition-all duration-150 cursor-default"
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13.5px] font-semibold text-[#1a1a2e]">{cred.role}</span>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-[5px] tracking-wide border ${cred.badgeClass}`}
                                        style={{ borderWidth: "1.5px" }}
                                    >
                                        {cred.badge}
                                    </span>
                                </div>
                                <span className="text-[12px] text-[#9090a0] font-mono">
                                    {cred.user} / {cred.pass}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleUse(cred)}
                                className="use-btn text-[12.5px] font-semibold bg-transparent border-none cursor-pointer whitespace-nowrap transition-colors duration-150 p-0"
                                style={{ color: "#8b1a30" }}
                            >
                                Use →
                            </button>
                        </div>
                        // </div>
                    ))}
                </div>
            </div >
        </>
    )
}