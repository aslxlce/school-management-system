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
