node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

VAULT_NAME=ft-next-syndication-api
HEROKU_APP_STAGING=ft-next-syndication-api-stag
HEROKU_APP_EU=ft-next-syndication-api

IGNORE_A11Y := true

coverage-report:
	@rm -rf ./coverage ./nyc_output
	@nyc --all --reporter=lcovonly --reporter=text make unit-test
	@$(DONE)

install-clean:
# delete the package-lock.json here so n-gage can install correctly
	rm -rf ./package-lock.json node_modules
	make install

kill-all:
	./node_modules/.bin/pm2 stop all
	./node_modules/.bin/pm2 kill

run:
	nht run --https

run-coveralls: coverage-report
	@cat ./coverage/lcov.info | coveralls | true
	@$(DONE)

run-list:
	while true; do clear; ./node_modules/.bin/pm2 list; echo ""; sleep 15; done

run-local:
	./node_modules/.bin/pm2 start procfile.json
	./node_modules/.bin/pm2 logs

run-monit:
	./node_modules/.bin/pm2 monit

test: verify
ifeq ($(CIRCLECI),true)
	@make run-coveralls
else
	@make coverage-report
endif

unit-test:
	@export IGNORE_A11Y=true
	@export NEW_SYNDICATION_USERS=testUserUuid1,testUserUuid2; \
	export NEW_SYNDICATION_USERS_AWAITING=testUserUuid3,testUserUuid4; \
	export NODE_ENV="test" && \
	node ./node_modules/.bin/mocha --full-trace --harmony --recursive --slow 15000 --sort --timeout 30000 test/
	@$(DONE)
