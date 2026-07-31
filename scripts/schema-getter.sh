# To be run in well-known-assets/schema directory.  Iterates through all our schemas and populates this static directory
for schema in $(curl https://schema.origincloud.net/registry.json | \
    jq -r 'keys[] as $k | "https://schema.origincloud.net/oobi/\($k)"') 
do
    mkdir "${schema##*/}"
    curl "${schema}" -o "${schema##*/}/index.json"
done
