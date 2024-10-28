'use client';

import { CustomButton } from "./CustomButton"

export const Navbar = () => {
    return (
        <>
            <div className="bg-white border-[0.4px] border-[#E3E4E9] px-12 md:px-20 flex flex-row justify-between items-center w-full h-[10%]">

                <div className="flex flex-row justify-between items-center gap-10">
                    <div>
                        <img src="/logo.svg" alt="logo" />
                    </div>
                </div>
                <div>
                    <CustomButton />
                </div>
            </div>
        </>
    )
}