#!/bin/bash

mkdir --parent ./public/assets/

for lang in CA DE EN ES FR IT OC; do
  curl https://admin.avalanche.report/textcat-ng/assets/satzkatalog.$lang.txt -o ./public/assets/satzkatalog.$lang.txt
done
