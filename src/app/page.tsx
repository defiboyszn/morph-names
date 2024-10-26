"use client";
import { useCallback, useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { useAccount, useContractWrite, useWriteContract } from "wagmi";
import { abi } from "../connectors/abi";
import { getAddress } from "../connectors/chains";
import { createPublicClient, http } from "viem";
import { morphHolesky } from "viem/chains";
import { config } from "./Providers";


const client = createPublicClient({
  chain: morphHolesky,
  transport: http(),
})




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

  
  return (
    <main className="flex flex-col justify-center items-center">
      <h1>Hello, Morph</h1>
    </main>
  );
}
