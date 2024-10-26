import { ConnectButton } from '@rainbow-me/rainbowkit';
export const CustomButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="font-DenimINKRegular rounded-[6px] border-[0.5px] border-[#E3E4E9] hover:bg-[#F7F8FA] hover:transition-all hover:delay-100 text-[#3A522E] flex flex-row justify-between items-center h-10 w-fit px-4"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="font-DenimINKRegular rounded-[6px] border-[0.5px] border-[#E3E4E9] hover:bg-[#F7F8FA] hover:transition-all hover:delay-100 text-[#3A522E] flex flex-row justify-between items-center h-10 w-fit px-4"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="font-DenimINKRegular rounded-[6px] border-[0.5px] border-[#E3E4E9] hover:bg-[#F7F8FA] hover:transition-all hover:delay-100 text-[#3A522E] flex flex-row justify-between items-center h-10 w-fit px-4"
                  >
                    {chain.hasIcon ? (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: '28px',
                          height: '28px',
                          borderRadius: 999,
                          overflow: 'hidden'
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 28, height: 28 }}
                          />
                        )}
                      </div>
                    ) : (
                      chain.name
                    )}
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="font-DenimINKRegular rounded-[6px] border-[0.5px] border-[#E3E4E9] hover:bg-[#F7F8FA] hover:transition-all hover:delay-100 text-[#3A522E] flex flex-row gap-4 items-center h-10 w-full px-4"
                   type="button"
                  >
                    {/* <Icon classes='' name={'link-square.svg'} size={[24, 24]} /> */}
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};