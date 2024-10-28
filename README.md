# Chyzcord [<img src="./browser/icon.png" width="225" align="left" alt="Chyzcord">](https://github.com/chyzman/Chyzcord)

[![Tests](https://github.com/chyzman/Chyzcord/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/chyzman/Chyzcord/actions/workflows/test.yml)

Chyzcord is a fork of [Equicord](https://github.com/Equicord/Equicord) which is a fork of [Vencord](https://github.com/Vendicated/Vencord)

You can't join our [discord server](https://chyz.xyz/box) because we don't have one.<br><br></br>

## Installing / Uninstalling

Windows
- [GUI](https://github.com/chyzman/ChyzcordInstaller/releases/latest/download/Chyzcord.exe)
- [CLI](https://github.com/chyzman/ChyzcordInstaller/releases/latest/download/ChyzcordInstaller.exe)

MacOS
- [GUI](https://github.com/chyzman/ChyzcordInstaller/releases/latest/download/Chyzcord.MacOS.zip)

Linux
- [CLI](https://github.com/chyzman/ChyzcordInstaller/releases/latest/download/ChyzcordInstaller-Linux)


## Installing Chyzcord Devbuild

### Dependencies
[Git](https://git-scm.com/download) and [Node.JS LTS](https://nodejs.dev/en/) are required.

Install `pnpm`:

> :exclamation: This next command may need to be run as admin/root depending on your system, and you may need to close and reopen your terminal for pnpm to be in your PATH.

```shell
npm i -g pnpm
```

> :exclamation: **IMPORTANT** Make sure you aren't using an admin/root terminal from here onwards. It **will** mess up your Discord/Chyzcord instance and you **will** most likely have to reinstall.

Clone Chyzcord:

```shell
git clone https://github.com/chyzman/Chyzcord
cd Chyzcord
```

Install dependencies:

```shell
pnpm install --frozen-lockfile
```

Build Chyzcord:

```shell
pnpm build
```
Inject Chyzcord into your client:

```shell
pnpm inject
```

## Credits

Thank you to [Vendicated](https://github.com/Vendicated) for creating [Vencord](https://github.com/Vendicated/Vencord) & [Equicord](https://github.com/Equicord) for creating [Equicord](https://github.com/Equicord/Equicord).

## Star History

<a href="https://star-history.com/#chyzman/Chyzcord&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=chyzman/Chyzcord&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=chyzman/Chyzcord&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=chyzman/Chyzcord&type=Timeline" />
  </picture>
</a>

## Disclaimer

Discord is trademark of Discord Inc. and solely mentioned for the sake of descriptivity.
Mentioning it does not imply any affiliation with or endorsement by Discord Inc.
Vencord is not connected to Equicord and Equicord is not connected to Chyzcord and as such, all donation links go to Vendicated's donation link.

<details>
<summary>Using Chyzcord violates Discord's terms of service</summary>

Client modifications are against Discord’s Terms of Service.

However, Discord is pretty indifferent about them and there are no known cases of users getting banned for using client mods! So you should generally be fine if you don’t use plugins that implement abusive behaviour. But no worries, all inbuilt plugins are safe to use!

Regardless, if your account is essential to you and getting disabled would be a disaster for you, you should probably not use any client mods (not exclusive to Chyzcord), just to be safe

Additionally, make sure not to post screenshots with Chyzcord in a server where you might get banned for it

</details>
