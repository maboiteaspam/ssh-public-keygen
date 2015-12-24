# ssh-public-keygen

generate ssh public keys

## Install

    npm i @maboiteaspam/ssh-public-keygen --save-dev

## Usage

```js
@maboiteaspam/ssh-public-keygen 1.0.0
generate ssh public keys

    Usage
        ssh-public-keygen [ssh hosts]
        ssh-public-keygen [ssh hosts]

    Options
        [ssh hosts]       Is a string such [host1 pwd1 host2 pwd2] (You would not use space in user / pwd, would you ?)
        -v                verbose
        -h                show help
        -t|--type         one of dsa | ecdsa | ed25519 | rsa | rsa1
        -y|--yes          add --yes flag
        -f|--file         Which file to save the key to, default is ~/.ssh/id_rsa' + [YYYYMMDD_HHMMSS]
        -p|--passphrase   your passphrase, default is empty.
        -c|--comment      Comment of the key, default is 'created with '+pkg.name+''.

    Examples
        ssh-public-keygen -v
        ssh-public-keygen -h

```

## More

Additional links and comments.