# .well-known KERI/GLEIF explainer

## What is .well-known?
[Well-known URI](https://en.wikipedia.org/wiki/Well-known_URI)

Its a poor-man's discovery tool that uses a website and a fixed directory structures to point to resources that may be available at a given domain/URI.

## Why are GLEIF and WebOfTrust pushing it?
See document attached to: https://eipi.atlassian.net/browse/VC-1743 or on the drive provided by GLEIF.  Generally there are a few reasons we should adopt it:
1. It is mandated by GLEIF through the governance framework so we have to do it.
2. It provides a way to easily share resources of the QVI ecosystem without any KERI specific dependencies.
3. It is integrated into the KERI toolset so that instead of generating static configs we can just point to .well-known resources of our own for our own internal discovery (at least until we come up with a more elegant scheme using DNS or LDAP or something.  [See:](https://www.kentbull.com/posts/configuring-keripy-keria-controllers-witnesses/#part-8-well-known-oobi-discovery)

The repo and scripts I've used to help us generate the same metadata and .well-known structure as GLEIF is available [here](https://github.com/WebOfTrust/WebOfTrust.github.io/blob/main/scripts/build-wellknown.py) and are described in the document mentioned above.

## How to generate and where the assets live.
The well-known assets live in well-known-assets/ and consist of `aid/`, `schema/`, and `witness/` for QVI relevant AIDs (our QVI AID and the GLEIF Root AID), schema AIDs we publish, and witness AIDs.

These are expected by the script to live in this directory and is what is used by the .well-known helper script located in `scripts/build-wellknown.py`.  

I have also created a few helper scripts in scripts/ to use a copy/paste job from our witness tracker google sheet and schema.provenant.net etc...  You can use or not when we need to update.

**Note: When calling the script be sure to pass the --host provenant.net (if publishing under that URL) argument or the metadata will generate for GLEIF.  Nothing will break but it won't be correct.**
