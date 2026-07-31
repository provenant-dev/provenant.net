while read -u 3 -r oobi && read -u 4 -r oobi_dir 
do
    mkdir "${oobi_dir}"
    curl -o "${oobi_dir}/index.json" "${oobi}" &
done 3<witness-urls-from-witness-version-tracker 4< <(sed 's?.*/\(.*\)/controller?\1?' witness-urls-from-witness-version-tracker)

wait
