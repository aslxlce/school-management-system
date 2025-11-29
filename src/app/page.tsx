import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="mt-8">
                <Link
                    href="/auth/sign-in"
                    className="btn btn-primary border rounded-lg bg-gray-200 p-5 "
                >
                    Sign In
                </Link>
            </div>
        </>
    );
}

// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//     return (
//         <div className="min-h-screen bg-white">
//             {/* NAVBAR */}
//             <nav className="w-full py-6 px-8 flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                     {/* LOGO */}
//                     <Image
//                         src="/logo_2.png" // your uploaded logo
//                         alt="AuroraCampus Logo"
//                         width={50}
//                         height={50}
//                         className="object-contain"
//                     />
//                     <span className="text-2xl font-bold text-gray-800">AuroraCampus</span>
//                 </div>

//                 <div className="flex items-center gap-10 text-gray-700">
//                     <Link href="#features" className="hover:text-blue-600">
//                         Features
//                     </Link>
//                     <Link href="#about" className="hover:text-blue-600">
//                         About
//                     </Link>
//                     <Link href="/auth/sign-in" className="hover:text-blue-600 font-semibold">
//                         Sign In
//                     </Link>
//                 </div>
//             </nav>

//             {/* HERO SECTION */}
//             <section className="px-8 lg:px-20 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//                 {/* LEFT TEXT */}
//                 <div>
//                     <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
//                         School <br /> Management <br /> System
//                     </h1>

//                     <p className="mt-6 text-gray-600 text-lg max-w-lg">
//                         Streamline your school’s operations with our comprehensive management
//                         platform. Simplify administration, enhance communication, and boost student
//                         success.
//                     </p>

//                     <Link
//                         href="/auth/sign-in"
//                         className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//                     >
//                         Get Started
//                     </Link>
//                 </div>

//                 {/* RIGHT IMAGE */}
//                 <div className="relative w-full h-[420px] lg:h-[500px] rounded-xl overflow-hidden shadow-md">
//                     <Image
//                         src="/student.png" // replace with your hero image
//                         alt="Student Image"
//                         fill
//                         className="object-cover"
//                     />
//                 </div>
//             </section>
//         </div>
//     );
// }
