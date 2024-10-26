'use client';
import { ReactElement } from 'react';
import { http, createConfig } from 'wagmi'
import { WagmiProvider } from 'wagmi'
import { morphHolesky } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
  appName: 'MorpNames',
  projectId: '29dbe980983c668624de895bbf91812b',
  chains: [morphHolesky],
});
const queryClient = new QueryClient()



export function Provider({ children }: { children: ReactElement }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitProvider showRecentTransactions={true}>
        {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}