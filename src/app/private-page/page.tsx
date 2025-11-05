'use client'

function PrivatePage() {
    // const { data: session, status } = useSession()

    // if (status === "loading") {
    //     return <p>Loading...</p>
    // }

    // if (status === "unauthenticated") {
    //     return <p>Access Denied</p>
    // }
    return (
        <div className=" grid place-items-center  gap-2 min-h-screen">
            <div className="text-center grid gap-3 ">
                <h2 className="text-3xl">This is private page only accessable while user is login</h2>
                <p>If you are seeing this it means you are logged in</p>
            </div>

        </div>
    )
}

export default PrivatePage