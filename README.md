# SecChat

A messaging dapp that gets the user paid each time he/she receives a spam, and creates an environment for the spammers that they can’t survive on the dapp, making it spam free.

## Youtube Video Link

https://youtu.be/0eZuTIME7lE

## Mantle Testnet Deployement

https://explorer.testnet.mantle.xyz/address/0x0e9dF147be69EfA819d5d3C6859B3b4d34a7CbA0

## Filecoin Hyperspace Testnet Deployement

https://explorer.glif.io/address/t410f2lmadhod27kclc46ko72z67ikf6epr46vzhvsaq/?network=hyperspace

## Mumbai Testnet Deployment

https://mumbai.polygonscan.com/address/0x4E6724E99083Cd5bC6b566FbEB15C72f748463fe

## Problem SecChat solves

Try - https://chat-web3.web.app/
We all use messaging apps in this world, and to be honest, we all would have received some messages like hey you’re a winner of the lucky draw, you are going to be a millionaire, share your bank details and credentials and we will transfer this huge loads of money to your account. All such messages are spams. Spam not only causes huge losses to businesses but individuals too. There is not a single messaging app that promotes such an environment to remain spam-free.
By our dapp we are creating such an incentive model that it becomes impossible for the spammers to survive on the dapp while rewarding the receivers to get paid on receiving spam at worst.

Working -
1. Sender needs to stake 0.1T, it gets locked at the contract, and he gets access to send messages to the receiver.

2. Now he writes the message to the receiver which goes as a request to the receiver.

3. Receiver has 2 options either to declare it as spam or to approve it,

4. Let’s suppose he declares it as spam, the amount the spammer staked goes from the contract to the receiver. For spam, the receiver gets rewarded.

5. Now to penalize the spammer, the SpamCount of the sender increments, and the amount staked gets multiplied by SpamCount, it also increases to 0.2T, so now next time the spammer wants to request a message he needs to stake 0.2T, and it keeps on increasing as he keeps on spamming more and more.

## Challenges Faced

1. Push SDK was very unpredictable, as it is in Alpha it keeps getting changed a lot and it resulted in unknown bugs which we need to handle carefully.
There was a corner case of the sender staking the amount and the receiver not responding to the request as spam or approving it, then to prevent the stake amount from being locked indefinitely, we implemented chain link automation which refunds all the staked amount locked in the contract every 24h.

2. There could be another scenario of the receiver being a spammer, and it keeps on declaring all the message requests as spam and earning the staked amount. To tackle it we have added a counter which counts the number of spam a user has declared others, and if this count is greater than 10, then we prompt the sender that, the receiver to whom you are sending the request has a bad history of declaring others as spam, and you may loose your staked amount. So be cautious to proceed. After this, it is the sender’s obligation to decide and act wisely.

3. We had one more feature of getting a notification that a message request on another network is present, but for that, we need to call some functions of a contract that is deployed on some network other than on which the user has logged in the SecChat. Till now we haven't been able to solve this issue.

4. At time it became difficult to sort the messages into requests and spam as there is no flags in the push chat sdk, so we implemented separate structures in the contract to handle and sort into respective categories.
