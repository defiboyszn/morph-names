"use client";
import { useCallback, useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { useAccount, useContractWrite, useWriteContract } from "wagmi";
import { abi } from "../connectors/abi";
import { getAddress, roundNumber } from "../connectors/chains";
import { createPublicClient, http, parseEther } from "viem";
import { morphHolesky } from "viem/chains";
import { config } from "./Providers";
import { CustomButton } from "../components/CustomButton";


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
  const [minted_domains, setMintedDomains] = useState([] as {
    name: string;
    owner: string;
    tld: string;
    avatar: string;
    image: string;
    price_usd: number;
  }[]);
  let [routeState, setRouteState]: any[] = useState(0)
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


  useEffect(() => {
    if (domain) {
      const domainLength = domain.length;

      let newPrice;

      if (domainLength >= 1 && domainLength <= 2) {
        newPrice = 0.080;
      } else if (domainLength >= 3 && domainLength <= 4) {
        newPrice = 0.020;
      } else {
        newPrice = 0.0060;
      }

      setPrice(roundNumber(newPrice));
    }
  }, [domain, value]);




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
        setPurchased(false);
        setLoading(false);
        console.log("Error", e);

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


  useEffect(() => {
    const oi = async () => {
      const data__ = await readContract(client, {
        address: getAddress(),
        abi: abi,
        functionName: 'getAllNames',
      });

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

      setMintedDomains(_data);
    };
    oi();


  }, [tld, minted_domains])

  const data = (minted_domains.length < 1 ? [{
    tld, name: "",
    owner: "0x00000000000000000000000000000000000000000000000",
    avatar: "",
    image: "",
    price_usd: 0
  }] : minted_domains)?.filter((data) => {
    const answer = data.name.toLocaleLowerCase().startsWith(domain.toLocaleLowerCase()) //match(name.toLocaleLowerCase());
    return answer
  });

  // useEffect(()=> {
  //   console.log(data);
  // },[tld,minted_domains])


  const client = createPublicClient({
    chain: morphHolesky,
    transport: http(),
  })


  return (
    <main className=" absolute w-full grid place-items-center h-[90%] ">
      {routeState === 0 ?
        <div className=" w-[45%] absolute">
          <div className="drop-shadow-md filter bg-white px-3 my-2 rounded-xl grid searchBar ">
            <div className="flex place-content-between relative ">
              <input
                type="text"
                placeholder="SEARCH FOR A NAME"
                className="w-[90%] text-black text-xl outline-none py-6"
                onChange={(e) => {
                  setDomain(e.target.value);
                  init()
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
            domain.length > 2 ?
              <div className=" py-1 -px-3 border-[1px] bg-white shadow-md rounded-xl text-black w-full">
                <div>
                  {domain.length > 2 && data.length < 1 ? (
                    <div>
                      <div className="px-4 text-gray-500 ">
                        <p>AVAILABLE</p>
                      </div>
                      <div className="m-1 h-full w-full flex justify-between px-4 py-2 " onClick={() => setRouteState(1)} >
                        <div className="w-full flex justify-start">
                          {domain}.{tld}
                        </div>
                        <button onClick={() => setRouteState(1)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {data.length > 0 && data.filter(_data => _data.name === `${domain}.${tld}`) ? <div className="px-4 pt-2">
                    <p>
                      NOT FOUND
                    </p>
                    <p className="pt-2">
                      <span className="text-[#00AB00]">{domain}.{tld}</span> has been taken
                    </p>
                  </div> : null}
                </div>
              </div>
              : null
          }
        </div>
        :
        <div className=" p-2 w-[50%] ">
          <div className=" w-[50%] mx-auto text-lg te flex text-black justify-between">
            <button onClick={() => {
              setRouteState(0)
              setDomain("")
            }} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <p className="text-gray-500">DOMAIN DETAILS</p>
            <p className="text-gray-500"></p>
          </div>

          <div className="mt-5">
            <div className="flex flex-row bg-green-500 text-4xl rounded-full w-[60%] mx-auto my-3 px-4 py-4 justify-evenly place-items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 stroke-red-500 fill-yellow-500 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              <p>{domain}.{tld}</p>
            </div>
          </div>

          <div className="shadow-md w-[75%] rounded-md mx-auto px-4 py-3 flex justify-between place-items-center text-black ">

            <div className="grid">
              <p className="text-2xl text-gray-500 ">AMOUNT</p>
              <div className="amount">
                <p className="text-gray-800">{price} ETH</p>
                {/* <p className="text-gray-500">$250.4</p> */}
              </div>
            </div>

            <div className="">
              {isConnected ? <>
                <button
                  className="font-DenimINKRegular rounded-[6px] border-[0.5px] border-[#E3E4E9] hover:bg-[#F7F8FA] hover:transition-all hover:delay-100 text-[#3A522E] flex flex-row gap-4 items-center h-10 w-full px-4"
                  onClick={purchaseDomain}
                >
                  {loading ? "Loading...." : "Purchase Domain"}
                </button>
              </> :
                <CustomButton />
              }
            </div>

          </div>
        </div>
      }
    </main>

  );
}
