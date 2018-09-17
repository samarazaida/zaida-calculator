RELEASE = npm run release

release:
	${RELEASE}

release-patch: release

release-minor:
	${RELEASE} -- minor

release-major:
	${RELEASE} -- major