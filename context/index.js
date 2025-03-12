import React, { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

import {
    CONNECT_WALLET,
    CHECK_ACCOUNT_BALANCE,
    CHECK_WALLET_CONNECTED,
    GET_BALANCE,
    TOKEN_ICO_CONTRACT,
    ERC20, ERC20_CONTRACT,
    TOKEN_ADDRESS,
    addtokenToMetaMask,
} from "./constants";

export const TOKEN_ICO_CONTEXT = React.createContext();

export const TOKEN_ICO_Provider = ({ children }) => {
    const DAPP_NAME = "TOKEN ICO DAPP";
    const currency = "ETH";
    const network = "Holesky";

    const [loader, setLoader] = useState(false);
    const [account, setAccount] = useState();
    const [count, setCount] = useState(0);

    const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });

    const notifyError = (msg) => toast.error(msg, { duration: 2000 });

    // ------- Contract Function -------

    const TOKEN_ICO = async () => {
        try {
            const address = await CHECK_WALLET_CONNECTED();
            if (address) {
                setLoader(true);
                setAccount(address);
                const contract = await TOKEN_ICO_CONTRACT();

                const tokenDetails = await contract.getTokenDetails();
                const contractOwner = await contract.owner();
                const soldTokens = await contract.soldTokens();

                const ethBal = await GET_BALANCE();

                const token = {
                    tokenBal: ethers.utils.formatEther(tokenDetails.balance.toString()),
                    name: tokenDetails.name,
                    symbol: tokenDetails.symbol,
                    supply: ethers.utils.formatEther(tokenDetails.supply.toString()),
                    tokenPrice: ethers.utils.formatEther(tokenDetails.tokenPrice.toString()),
                    tokenAddr: tokenDetails.tokenAddr,
                    maticBal: ethBal,
                    address: address.toLowerCase(),
                    owner: contractOwner.toLowerCase(),
                    soldTokens: soldTokens.toLowerCase(),
                };
                setLoader(false);
            }
        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    const BUY_TOKEN = async (amount) => {
        try {
            setLoader(true);
            const address = await CHECK_WALLET_CONNECTED();

            const tokenDetails = await contract.getTokenDetails();

            const availbleTokens = ethers.utils.formatEther(tokenDetails.balance.toString());

            if (availbleTokens > 1) {
                const price = ethers.utils.formatEther(tokenDetails.tokenPrice.toString());

                const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

                const transaction = await contract.BUY_TOKEN(Number(account), {
                    value: payAmount.toString(),
                    gasLimit: ethers.utils.hexlify(8000000)
                });

                await transaction.wait();
                setLoader(false);
                notifySuccess("Transaction Completed Successful");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    const TOKEN_WITHDRAW = async () => {
        try {
            setLoader(true);
            const address = await CHECK_WALLET_CONNECTED();

            if (address) {
                const contract = await TOKEN_ICO_CONTRACT();

                const tokenDetails = await contract.getTokenDetails();

                const availbleTokens = ethers.utils.formatEther(tokenDetails.balance.toString());

                if (availbleTokens > 1) {
                    const transaction = await contract.withdreawAllTokens();

                    await transaction.wait();
                    setLoader(false);
                    notifySuccess("Transaction Completed Successful");
                    window.location.reload();

                }
            }
        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    const UPDATE_TOKEN = async (_address) => {
        try {
            setLoader(true);
            const address = await CHECK_WALLET_CONNECTED();

            if (address) {
                const contract = await TOKEN_ICO_CONTRACT();

                const transaction = await contract.updateToken(_address);

                await transaction.wait();
                setLoader(false);
                notifySuccess("Transaction Completed Successful");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    const UPDATE_TOKEN_PRICE = async (price) => {
        try {
            setLoader(true);
            const address = await CHECK_WALLET_CONNECTED();

            if (address) {
                const contract = await TOKEN_ICO_CONTRACT();
                const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

                const transaction = await contract.updateTokenSalePrice(payAmount);

                await transaction.wait();
                setLoader(false);
                notifySuccess("Transaction Completed Successful");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    const DONATE = async (AMOUNT) => {
        try {
            setLoader(true);
            const address = await CHECK_WALLET_CONNECTED();

            if (address) {
                const contract = await TOKEN_ICO_CONTRACT();
                const payAmount = ethers.utils.parseUnits(AMOUNT.toString(), "ether");

                const transaction = await contract.transferToOwner(payAmount, {
                    value: payAmount.toString(),
                    gasLimit: ethers.utils.hexlify(8000000)
                });

                await transaction.wait();
                setLoader(false);
                notifySuccess("Transaction Completed Successful");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    const TRANSFER_ETHER = async (transfer) => {
        try {
            setLoader(true);

            const { _receiver, _amount } = transfer;
            const address = await CHECK_WALLET_CONNECTED();

            if (address) {
                const contract = await TOKEN_ICO_CONTRACT();
                const payAmount = ethers.utils.parseUnits(_amount.toString(), "ether");

                const transaction = await contract.TRANSFER_ETHER(_receiver, payAmount, {
                    value: payAmount.toString(),
                    gasLimit: ethers.utils.hexlify(8000000)
                });

                await transaction.wait();
                setLoader(false);
                notifySuccess("Transaction Completed Successful");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    const TRANSFER_TOKEN = async (transfer) => {
        try {
            setLoader(true);

            const { _tokenAddress, _sendTo, _amount } = transfer;
            const address = await CHECK_WALLET_CONNECTED();

            if (address) {
                const contract = await ERC20_CONTRACT(_tokenAddress);
                const payAmount = ethers.utils.parseUnits(_amount.toString(), "ether");

                const transaction = await contract.transfer(_sendTo, payAmount, {
                    gasLimit: ethers.utils.hexlify(8000000)
                });

                await transaction.wait();
                setLoader(false);
                notifySuccess("Transaction Completed Successful");
                window.location.reload();
            }

        } catch (error) {
            console.log(error);
            notifyError("error try again later", error);
            setLoader(false);
        }
    };

    return (
        <TOKEN_ICO_CONTEXT.Provider value={{
            TOKEN_ICO,
            BUY_TOKEN,
            TRANSFER_ETHER,
            DONATE,
            UPDATE_TOKEN,
            UPDATE_TOKEN_PRICE,
            TOKEN_WITHDRAW,
            TRANSFER_TOKEN,
            CONNECT_WALLET,
            ERC20,
            CHECK_ACCOUNT_BALANCE,
            setAccount,
            setLoader,
            addtokenToMetaMask,
            TOKEN_ADDRESS,
            loader,
            account,
            currency,
        }}>
            {children}
        </TOKEN_ICO_CONTEXT.Provider>
    );
};
