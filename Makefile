VERSION=`node -pe "require('./package.json').version"`

release:
	npx run.env release-it ${VERSION}