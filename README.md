# STEEMfilestore

![schermata da 2018-07-07 12-14-08](https://user-images.githubusercontent.com/8074/42409753-516e04c8-81df-11e8-9d60-823fe4909d75.png)

### Immutable, censorship resistant, cheap, time proof, file storage on STEEM blockchain

STEEMfilestore uploads files on STEEM blockchain as multiple transactions (actions), it doesn't cost STEEM but you need enough staking in CPU and NET.


## Installation

```
sudo npm install -g steemfilestore 
```

Then run `steemfilestore` and edit `~/.steemfilestore/config.json` with your **account** (from) and **wif** (private key)

## Usage

```
steemfilestore cost myfile.txt       # an estimate how many STEEM it will need
steemfilestore push myfile.txt       # it will generate the txs and upload the file on STEEM Blockchain
steemfilestore get <txid> myfile.txt # it will download the file from the STEEM Blockchain
```

## How does it work?

1. The file is base64 encoded
2. N transactions are generated and broadcasted to the STEEM Blockchain
3. Every tx link to the next one

## Donate

If you like this software you can **donate STEEM** to `@luigi-tecnologo` account.

## License

STEEMfilestore is [MIT licensed](./LICENSE).
