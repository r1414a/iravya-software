import { useState } from "react"; 
import { UserRound } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { Eye } from 'lucide-react';
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Search } from 'lucide-react';
const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600&display=swap');`;
 
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600&display=swap');
    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-down { animation: fadeDown 0.6s ease both; }
    .animate-fade-up   { animation: fadeUp 0.55s ease 0.1s both; }
    .input-field::placeholder { color: #b0b0c0; }
    .input-field:focus {
      outline: none;
      border-color: #8b1a30 !important;
      background: #fff !important;
      box-shadow: 0 0 0 3px rgba(139,26,48,0.08) !important;
    }
    .btn-signin:hover {
      background: linear-gradient(135deg,#a01f38,#7c1428) !important;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(139,26,48,0.4) !important;
    }
    .link-action:hover { color: #c0395a !important; text-decoration: underline; }
    .cred-card:hover   { border-color: #d0c0c8 !important; box-shadow: 0 2px 8px rgba(139,26,48,0.06); }
    .use-btn:hover     { color: #c0395a !important; }
  `}</style>
);


const credentials = [
  { role: "Manager", badge: "manager", badgeClass: "badge-manager", user: "manager", pass: "manager@123456" },
  { role: "Technician", badge: "technician", badgeClass: "badge-technician", user: "technician", pass: "tech@123456" },
];


function EyeIcon({ show }) {
  return show ? (
    <Eye className="text-gray-400" size={20}/>
  ) : (
    <AiOutlineEyeInvisible  className="text-gray-400" size={20}/>
  );
}
export default function Auth() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);

    const handleUse = (cred) => {
        setUsername(cred.user);
        setPassword(cred.pass);
    };
    return (
        <>
            <GlobalStyles />
        
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
                {/* <span className="text-[11px] font-medium tracking-[3px] uppercase text-white/55 -mt-1">
                    Service Management
                </span> */}
                </div>
        
                {/* Card */}
                <div
                className="bg-white rounded-2xl w-full max-w-[420px] animate-fade-up"
                style={{
                    padding: "36px 40px 32px",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.12)",
                }}
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
                    <UserRound className="absolute left-3.5 top-1/3 text-gray-400"size={16}  />
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
                    <LockKeyhole className="absolute left-3.5 top-1/3 text-gray-400" size={16}/>
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
                    <EyeIcon show={showPw} />
                    </button>
                </div>
        
                {/* Sign In button */}
                <button
                    type="button"
                    className="btn-signin w-full py-3.5 text-white text-[15px] font-semibold rounded-[10px] mt-1.5 tracking-wide cursor-pointer border-none transition-all duration-150"
                    style={{
                    background: "linear-gradient(135deg, #8b1a30, #6b1223)",
                    boxShadow: "0 4px 18px rgba(139,26,48,0.32)",
                    fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    Sign In
                </button>
       
                </div>
            </div>
        </>
    )
}
