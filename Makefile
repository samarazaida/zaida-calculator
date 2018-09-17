VERSION=`node -pe "require('./package.json').version"`

release:
	npm run release ${VERSION}