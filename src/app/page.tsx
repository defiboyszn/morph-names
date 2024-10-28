"use client";
import { useCallback, useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { useAccount, useContractWrite, useWriteContract } from "wagmi";
import { abi } from "../connectors/abi";
import { getAddress } from "../connectors/chains";
import { createPublicClient, http } from "viem";
import { morphHolesky } from "viem/chains";
import { config } from "./Providers";
import { CustomButton } from "../components/CustomButton";
const names = [
  { name: "Jane", amt: 0.003 },
  { name: "Borris", amt: 1.041 },
  { name: "Hero", amt: 0.001 },
  { name: "Liame", amt: 0.102 },
  { name: "Trump", amt: 0.606 },
  { name: "Payne", amt: 0.307 },
  { name: "Hedge", amt: 0.642 },
  { name: "Flag", amt: 1.04 },
];


function calculatePrice(basePrice: number, expiryTimestamp: number): number {
  const currentTime: number = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeDifference: number = expiryTimestamp - currentTime;
  
  if (timeDifference > 0) {
    // Increase the base price by 20% for each minute beyond the expiry time (5 minutes)
    const priceIncreasePercentage: number = 0.2;
    const minutesBeyondExpiry: number = timeDifference / 60;
    const priceIncrease: number = basePrice * priceIncreasePercentage * minutesBeyondExpiry;
    return basePrice + priceIncrease;
  }

  return basePrice;
}
const tld = "morph"
export default function Home() {
  const [price, setPrice] = useState(0);
  const [price_usd, setPriceUsd] = useState(0);
  let [purchased, setPurchased] = useState(false);
  let [loading, setLoading] = useState(false);
  let [searching, setSearching] = useState(false);
  let [purchased_data, setPurchasedData] = useState({} as {
    hash: string
    [x: string]: string | boolean
  });
  const [value, setValue] = useState(1);
  const [domain, setDomain] = useState("" as string);
  const { isConnected } = useAccount()
  const [minted_domain, setMintedDomain] = useState({} as {
    name: string;
    owner: string;
    tld: string;
    avatar: string;
    image: string;
    price_usd: number;
  });
  let [person,setPerson]: any[] = useState([])
  const getDomain = useCallback(async (name: string) => {
    const $ = await readContract(client, {
      address: getAddress(),
      abi: abi,
      functionName: 'getDomain',
      args: [name.toLowerCase()]
    }) as Array<any>
    return $ as any;
  }, [domain]);
  const { writeContractAsync: writeAsyncNative } = useWriteContract({
    config: config,
  })
  const purchaseDomain = async () => {
    setLoading(true);
    if (!domain) {
      setLoading(false);
      return
    }
    if (domain.length < 1) {
      alert('Domain must be at least 1 characters long');
      setLoading(false);
      return;
    } else if (domain.length >= 11) {
      alert('Domain must not be higher than 10 characters long');
      setLoading(false);
      return;
    }
    // const price = domain.length >= 2 ? Number('20') : (domain.length === 3) ? Number('4') : Number('1.5');
    try {
      setLoading(true);

      writeAsyncNative({
        abi,
        address: getAddress(),
        functionName: "register",
        args: [domain.toLowerCase()],
        // @ts-ignore
        value: parseEther(`${price}` as any),
      }).then((data) => {
        setPurchasedData({ title: "Domain minted!", hash: (data) });
        setPurchased(true);
        setDomain('');
        setLoading(false);
      }).catch((e) => {
        setPurchasedData({ title: "Transaction failed! Please try again", error: true, hash: "0x000", message: (e?.details) as string });
        setPurchased(true);
        setLoading(false);
      })
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  const init = async () => {
    setSearching(true)
    const data__ = await readContract(client, {
      address: getAddress(),
      abi: abi,
      functionName: 'getAllNames',
    });

    if (domain?.length > 0) {
      const _data = await Promise.all((data__ as any).map(async (data$: string) => {
        const data_ = await getDomain(data$.split(".")[0])
        let dataa = {} as {
          name: string;
          owner: string;
          avatar: string;
          image: string;
          price_usd?: number;
          tld: string;
        };
        dataa.owner = data_.owner;
        dataa.name = data_.name;
        dataa.image = data_.image;
        dataa.avatar = data_.avatar;
        dataa.tld = data_.tld;
        return dataa
      }))

      const filtered = _data.filter(data => data.name === `${domain}.${tld}`)[0]
      setMintedDomain(filtered)
      setSearching(false)
    }
  }

  const [name, setName] = useState("");
  const data = names.filter((data) => {
    const answer = data.name.toLocaleLowerCase().startsWith(name.toLocaleLowerCase()) //match(name.toLocaleLowerCase());
    return answer
  });

  function Foward(param:any){
    setPerson([])
    setPerson([param])    
  }

  function Backward(){
    setPerson([])
  }

const client = createPublicClient({
  chain: morphHolesky,
  transport: http(),
})

  
  return (
    <main className=" absolute w-full grid place-items-center h-[90%] ">
       {person.length ===0 ? 
        <div className=" w-[45%] absolute">
        <div className=" bg-white px-3 my-2 rounded-xl grid searchBar ">
          <div className="flex place-content-between relative ">
            <input
              type="search"
              placeholder="SEARCH FOR A NAME"
              className="w-[90%] text-black text-xl outline-none py-6"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <button className="text-gray-900 w-[10%] grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>

        {
        name.length >2?
        <div className=" py-1 -px-3 border-[1px] bg-white shadow-md text-black w-full">
          <div className="">
            {name.length >2 ? data.map((a) =>
            <div>
                <div className="px-4 text-gray-500 ">
                    <p>AVAILABLE</p>
                </div>
                <div className="m-1 h-full w-full flex justify-between px-4 py-2 " onClick={()=> Foward(a)} >
                    <div className="w-full flex justify-start">
                        {a.name}
                    </div>
                    <button onClick={()=> Foward(a)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>
            ): null}
            {data.length < 1 ? <div className="px-4">NOT FOUND</div>: null }
          </div>
        </div>
        : null
        }
        </div>
        : 
        <div className=" p-2 w-[50%] ">
          <div className=" w-[50%] mx-auto text-lg te flex text-black justify-between">
            <button onClick={()=>Backward()} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <p className="text-gray-500">DOMAIN DETAILS</p>
          </div>

          <div className="mt-5">
            <div className="flex bg-green-500 text-5xl rounded-full w-[60%] mx-auto my-3 px-4 py-4 justify-evenly place-items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 stroke-red-500 fill-yellow-500 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              <p>{person[0].name}.morph</p>
            </div>
          </div>

          <div className="shadow-md w-[75%] rounded-md mx-auto px-4 py-3 flex justify-between place-items-center text-black ">

            <div className="grid">
              <p className="text-2xl text-gray-500 ">AMOUNT</p>
              <div className="amount">
                <p className="text-gray-800">{person[0].amt}ETH</p>
                <p className="text-gray-500">$250.4</p>
              </div>
            </div>

            <div className="">
              <CustomButton/>
            </div>

          </div>
        </div>
      }
    </main>

  );
}
