module.exports = {
	files: {
		allow: [
			'pandoc-dpkg/usr/bin/pandoc',
			'pandoc-dpkg/usr/bin/pandoc-citeproc',
			'pandoc-dpkg/usr/share/doc/pandoc/copyright',
			'pandoc-dpkg/usr/share/man/man1/pandoc-citeproc.1.gz',
			'pandoc-dpkg/usr/share/man/man1/pandoc.1.gz',
			'test/fixtures/article.docx',
			'test/fixtures/article.plain',
			'test/fixtures/pandoc_stub',
			'test/fixtures/podcast.m4a',
			'test/fixtures/video-small.mp4'
		],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'60084cef\\x2d9c34\\x2d4d12\\x2d8407\\x2dea7007f0054e', // README.md:206
			'591a46cb\\x2d4551\\x2d4b05\\x2d9d49\\x2df30250d9f0b0', // doc/syndication-api-postman.json:3
			'ec1fe89c\\x2de687\\x2d417a\\x2dbf8e\\x2d012f4825e6cc', // doc/syndication-api-postman.json:20|31|351|362|377|388|403|414|429|440
			'17620a3b\\x2db82d\\x2d4b85\\x2daa85\\x2d4cf2793b7a02', // doc/syndication-api-postman.json:86
			'd@test\\.com', // doc/syndication-api-postman.json:194
			'3fa5612f\\x2d042a\\x2d4ce1\\x2d9a5a\\x2d75292fd3ddef', // doc/syndication-api-postman.json:194
			'c3e9b81a\\x2dc477\\x2d11e7\\x2db2bb\\x2d322b2cb39656', // doc/syndication-api-postman.json:481
			'4d31c9e5\\x2deafe\\x2d4639\\x2dbba0\\x2d24d7a488b08f', // runbook.md:54
			'42ad255a\\x2d99f9\\x2d11e7\\x2db83c\\x2d9588e51488a0', // test/api/download-by-content-id-api.spec.js:17, test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:2|3|10|86|87|452|453|454, test/fixtures/content/items.json:3|4|11|89|90|455|456|457, test/server/controllers/download-by-content-id.spec.js:38, test/server/controllers/resolve.spec.js:32|45|46|249, test/server/controllers/unsave-by-content-id.spec.js:35|36|58|65|66|67|78|80|82|85|148|149|167|174|175|176|188|190|192|195, test/server/lib/builders/document-builder.spec.js:23, test/server/lib/download/article.spec.js:47, test/server/lib/download/index.spec.js:37, test/server/lib/enrich/article.js:23, test/server/lib/enrich/index.js:26, test/server/lib/get-content-by-id.spec.js:47, test/server/lib/get-content.spec.js:23
			'john\\.q@average\\.com', // test/db/pg/map-columns.spec.js:27, test/fixtures/contractProfile.json:7
			'0c56a4f2\\x2d6bc5\\x2d11e7\\x2dbfeb\\x2d33fe0c5b7eaa', // test/db/pg/map-columns.spec.js:76|95, test/server/controllers/history.spec.js:31|91|101|109|114, test/server/lib/get-history-by-contract-id.spec.js:26
			'8ef593a8\\x2deef6\\x2d448c\\x2d8560\\x2d9ca8cdca80a5', // test/db/pg/map-columns.spec.js:80|99|102, test/fixtures/google-spreadsheet.json:11, test/fixtures/licenceUsers.json:8, test/fixtures/userResponse.json:2, test/server/controllers/export.spec.js:42, test/server/controllers/history.spec.js:34|48|62|75|222|338|457|576, test/server/controllers/resolve.spec.js:44, test/server/controllers/translations.spec.js:50|153|311|469|629|793, test/server/controllers/unsave-by-content-id.spec.js:37|150, test/server/lib/get-all-existing-items-for-contract.spec.js:31, test/server/lib/get-history-by-contract-id.spec.js:29|43|57|70|135, test/server/middleware/check-if-new-syndication-user.spec.js:29, test/server/middleware/get-contract-by-id-from-session.spec.js:99|101|185|187, test/server/middleware/get-users-for-licence.spec.js:113
			'c3391af1\\x2d0d46\\x2d4ddc\\x2da922\\x2ddf7c49cf1552', // test/db/pg/map-columns.spec.js:84|104, test/server/controllers/history.spec.js:36|50|64|77|277|395|514|633, test/server/controllers/translations.spec.js:114|222|380|540|698|862, test/server/lib/get-history-by-contract-id.spec.js:31|45|59|72
			'9807a4b6dcb3ce1188593759dd6818cd', // test/db/pg/map-columns.spec.js:86|86|106|106, test/server/controllers/history.spec.js:38|38, test/server/controllers/unsave-by-content-id.spec.js:32|32|145|145, test/server/lib/get-history-by-contract-id.spec.js:33|33
			'foo@bar\\.com', // test/db/toPutItem.spec.js:69, test/queue/message-queue-event.spec.js:86|144|183|228|262|295|334|380, test/queue/publish.spec.js:98, test/server/controllers/download-by-content-id.spec.js:107|200, test/server/controllers/export.spec.js:194|274, test/server/controllers/save-by-content-id.spec.js:94, test/server/controllers/unsave-by-content-id.spec.js:111|222, test/server/controllers/update-download-format.spec.js:75|93|109, test/server/controllers/user-status.spec.js:97|130|163, test/worker/persist.spec.js:44, test/worker/sync/db-persist/mail-contributor.spec.js:76|167, test/worker/sync/db-persist/spoor-publish.spec.js:75, test/worker/sync/db-persist/upsert-history.spec.js:61
			'2778b97a\\x2d5bc9\\x2d11e7\\x2d9bc8\\x2d8055f264aa8b', // test/fixtures/2778b97a-5bc9-11e7-9bc8-8055f264aa8b.json:2|12|20
			'0592f436\\x2d5c0c\\x2d11e7\\x2d2b35\\x2d7545c1789969', // test/fixtures/2778b97a-5bc9-11e7-9bc8-8055f264aa8b.json:4|14
			'dbb0bdae\\x2d1f0c\\x2d11e4\\x2db0cb\\x2db2227cce2b54', // test/fixtures/2778b97a-5bc9-11e7-9bc8-8055f264aa8b.json:13, test/fixtures/80d634ea-fa2b-46b5-886f-1418c6445182.json:12, test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:13, test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:15, test/fixtures/d7bf1822-ec58-4a8e-a669-5cbcc0d6a1b2.json:13, test/fixtures/dbe4928a-5bec-11e7-b553-e2df1b0c3220.json:13, test/server/controllers/history.spec.js:102|128|157|183, test/server/lib/decorate-article.spec.js:26
			'80d634ea\\x2dfa2b\\x2d46b5\\x2d886f\\x2d1418c6445182', // test/fixtures/80d634ea-fa2b-46b5-886f-1418c6445182.json:2|11|53, test/server/lib/resolve/id.spec.js:15
			'd0842750\\x2d9903\\x2d4bf9\\x2d2ee7\\x2df3d98afabc1e', // test/fixtures/80d634ea-fa2b-46b5-886f-1418c6445182.json:13
			'b59dff10\\x2d3f7e\\x2d11e7\\x2d9d56\\x2d25f963e998b2', // test/fixtures/article.html:6, test/fixtures/article.plain:12, test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:2|12|20, test/server/controllers/export.spec.js:63|75, test/server/controllers/resolve.spec.js:78, test/server/controllers/save-by-content-id.spec.js:30, test/server/lib/convert-article.spec.js:15, test/server/lib/decorate-article.spec.js:15|25|33, test/server/lib/to-plain-text.spec.js:22|30
			'16a642f4\\x2d3f84\\x2d11e7\\x2d1cd0\\x2d1ef14f87a411', // test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:4|14, test/server/lib/decorate-article.spec.js:17|27
			'faf86fbc\\x2d0009\\x2d11df\\x2d8626\\x2d00144feabdc0', // test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:21, test/server/lib/decorate-article.spec.js:34, test/server/lib/get-word-count.spec.js:58
			'c7923fba\\x2d1d31\\x2d39fd\\x2d82f0\\x2dba1822ef20d2', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:2|12, test/server/controllers/export.spec.js:43|55|83|95|105|116, test/server/controllers/resolve.spec.js:57|98|119
			'34b704a0\\x2d54d7\\x2d11e7\\x2d9fed\\x2dc19e2700005f', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:4|5
			'b4fac748\\x2da2b1\\x2d4b7d\\x2d8e1f\\x2d03ba743ff717', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:14
			'00004ffc\\x2d004e\\x2d50ad\\x2d0337\\x2d456ae1b1861c', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:17
			'6ce05235\\x2dc102\\x2d48b9\\x2da886\\x2d95dbd7f40419', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:19
			'0002839e\\x2d6dd8\\x2d34ff\\x2dae14\\x2de5dfb40b2eff', // test/fixtures/content/0002839e-6dd8-34ff-ae14-e5dfb40b2eff.json:2|3|8|26|28|95|96|97, test/server/lib/enrich/index.js:25, test/server/lib/enrich/video.js:27
			'7a9f5398\\x2d9c4d\\x2d4379\\x2d9980\\x2d6800fae6a3dc', // test/fixtures/content/0002839e-6dd8-34ff-ae14-e5dfb40b2eff.json:30|124
			'5216ff2e\\x2da6ed\\x2d42b2\\x2da613\\x2d109fc6491ba2', // test/fixtures/content/0002839e-6dd8-34ff-ae14-e5dfb40b2eff.json:40|42|78|80|110
			'c91b1fad\\x2d1097\\x2d468b\\x2dbe82\\x2d9a8ff717d54c', // test/fixtures/content/0002839e-6dd8-34ff-ae14-e5dfb40b2eff.json:56|58, test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:254|256, test/fixtures/content/items.json:257|259
			'd2638930\\x2d7db3\\x2d11e7\\x2dab01\\x2da13271d1ee9c', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:38|49|50|56|60|84|85|481, test/fixtures/content/items.json:41|52|53|59|63|87|88|484, test/server/lib/builders/document-builder.spec.js:179|195
			'69837688\\x2d9a04\\x2d11e7\\x2db83c\\x2d9588e51488a0', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:68|69|71|75, test/fixtures/content/items.json:71|72|74|78
			'ad26302e\\x2d9879\\x2d11e7\\x2d8c5c\\x2dc8d8fa6961bb', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:95, test/fixtures/content/items.json:98
			'de3e1832\\x2d97cc\\x2d11e7\\x2db83c\\x2d9588e51488a0', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:102|113|116, test/fixtures/content/items.json:105|116|119
			'19b95057\\x2d4614\\x2d45fb\\x2d9306\\x2d4d54049354db', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:120, test/fixtures/content/items.json:123
			'0501c122\\x2d995c\\x2d11e7\\x2d8c5c\\x2dc8d8fa6961bb', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:132, test/fixtures/content/items.json:135
			'd17153e9\\x2df07d\\x2d49ad\\x2d8dbd\\x2d4cb23d6bbc9b', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:139|143|144|207|211|212, test/fixtures/content/items.json:142|146|147|210|214|215
			'd43c7982\\x2d97d1\\x2d11e7\\x2db83c\\x2d9588e51488a0', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:146|157|160, test/fixtures/content/items.json:149|160|163
			'1d556016\\x2dad16\\x2d4fe7\\x2d8724\\x2d42b3fb15ad28', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:164, test/fixtures/content/items.json:167
			'b9d7e924\\x2d996a\\x2d11e7\\x2d8c5c\\x2dc8d8fa6961bb', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:182, test/fixtures/content/items.json:185
			'6a21c3e0\\x2d995c\\x2d11e7\\x2da652\\x2dcde3f882dd7b', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:189|200|203, test/fixtures/content/items.json:192|203|206
			'6b683eff\\x2d56c3\\x2d43d9\\x2dacfc\\x2d7511d974fc01', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:222|224, test/fixtures/content/items.json:225|227
			'04126152\\x2d5bef\\x2d4dda\\x2d86bf\\x2d81f66c00a342', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:238|240, test/fixtures/content/items.json:241|243
			'f7428da5\\x2dc1d2\\x2d35d7\\x2dabef\\x2d95be5f382b78', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:270|272|282|283, test/fixtures/content/items.json:273|275|285|286
			'a579350c\\x2d61ce\\x2d4c00\\x2d97ca\\x2dddaa2e0cacf6', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:286|288|299|300|374|376|387|388, test/fixtures/content/items.json:289|291|302|303|377|379|390|391
			'466a4700\\x2d307f\\x2d47cc\\x2d83f1\\x2dc5f97a172232', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:303|305|315|316|435|437|447|448|467|471|472, test/fixtures/content/items.json:306|308|318|319|438|440|450|451|470|474|475
			'dd4b519f\\x2de896\\x2d4322\\x2d8f77\\x2d25c936eb9d32', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:319|321|392|394, test/fixtures/content/items.json:322|324|395|397
			'33b4cf11\\x2d6854\\x2d4dc5\\x2daadb\\x2df0a671da0753', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:335|337|408|410, test/fixtures/content/items.json:338|340|411|413
			'049291ca\\x2dc558\\x2d4b3d\\x2dac99\\x2dcdc2e19dfc46', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:357|359, test/fixtures/content/items.json:360|362
			'52be3c0c\\x2d7831\\x2d11e7\\x2da3e8\\x2d60495fe6ca71', // test/fixtures/content/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:2|3|6|38|39|59, test/fixtures/content/es/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:2|14|18|19|25|26, test/server/controllers/translations.spec.js:31|35, test/server/lib/resolve/lang/es/previewText.spec.js:23
			'32d8f4b0\\x2d5d58\\x2d434d\\x2db578\\x2d337486e9f714', // test/fixtures/content/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:11
			'260b270a\\x2d723d\\x2d11e7\\x2d93ff\\x2d99f383b09ff9', // test/fixtures/content/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:28
			'93991a3c\\x2d0436\\x2d41bb\\x2d863e\\x2d61242e09859c', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:2|21|22, test/fixtures/content/items.json:1495|1514|1515, test/server/controllers/resolve.spec.js:37|321, test/server/lib/enrich/index.js:31, test/server/lib/enrich/podcast.js:28, test/server/lib/get-content-by-id.spec.js:113|170, test/server/lib/get-content.spec.js:28
			'thehitsthatshooktheworld', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:3|26, test/fixtures/content/items.json:1496|1519
			'72ecae21\\x2daf5a\\x2d46db\\x2d914c\\x2df8072d342bd2', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:31|32|100|101|117|118, test/fixtures/content/items.json:1524|1525|1593|1594|1610|1611
			'1d3f86a4\\x2d4df8\\x2d3652\\x2dadfc\\x2ddcae9e6645a5', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:43|45|111|113|129|131, test/fixtures/content/items.json:1536|1538|1604|1606|1622|1624
			'02afce67\\x2d6a86\\x2d3e49\\x2d8425\\x2d5f026b0d9be4', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:48|49, test/fixtures/content/items.json:1541|1542
			'f967910f\\x2d67d5\\x2d31f7\\x2da031\\x2d64f8af0d9cf1', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:65|66, test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:76|78, test/fixtures/content/items.json:1558|1559
			'bea65a67\\x2dc2e3\\x2d3488\\x2d820a\\x2d5c21074b34e5', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:82|83, test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:82|83, test/fixtures/content/items.json:1432|1433|1575|1576
			'98b46b5f\\x2d17d3\\x2d40c2\\x2d8eaa\\x2d082df70c5f01', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:2|21|22, test/fixtures/content/items.json:1352|1371|1372, test/server/controllers/resolve.spec.js:36|307, test/server/lib/download/index.spec.js:39, test/server/lib/download/podcast.spec.js:52, test/server/lib/enrich/index.js:30, test/server/lib/enrich/podcast.js:27, test/server/lib/get-content-by-id.spec.js:112|169, test/server/lib/get-content.spec.js:27
			'1ccd0d9f\\x2d8849\\x2d32a6\\x2d941a\\x2d0d37e1001603', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:31|32|100|101|117|118, test/fixtures/content/items.json:1381|1382|1450|1451|1467|1468
			'dee66cf5\\x2d5374\\x2d4674\\x2d9f70\\x2d90cccbc9604a', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:43|45|111|113|129|131, test/fixtures/content/items.json:1393|1395|1461|1463|1479|1481
			'd969d76e\\x2df8f4\\x2d34ae\\x2dbc38\\x2d95cfd0884740', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:48|49, test/fixtures/content/items.json:1398|1399
			'89d15f70\\x2d640d\\x2d11e4\\x2d9803\\x2d0800200c9a66', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:65|66|77|79, test/fixtures/content/items.json:1415|1416|1427|1429
			'a1af0574\\x2deafb\\x2d41bd\\x2daa4f\\x2d59aa2cd084c2', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:2|3|8|35|66|259|260|261, test/fixtures/content/items.json:1051|1052|1057|1084|1115|1308|1309|1310, test/server/controllers/download-by-content-id.spec.js:125, test/server/controllers/resolve.spec.js:35|128|129|293, test/server/lib/enrich/index.js:29, test/server/lib/enrich/video.js:29, test/server/lib/get-content-by-id.spec.js:111|168, test/server/lib/get-content.spec.js:26
			'996fbb84\\x2d96d7\\x2d11e7\\x2db83c\\x2d9588e51488a0', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:16|17, test/fixtures/content/items.json:1065|1066
			'3cf28f7f\\x2d78ff\\x2d4c1f\\x2da197\\x2d896dea2a9595', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:68|288, test/fixtures/content/items.json:1117|1337
			'6d0d2fab\\x2d102e\\x2d32f8\\x2dbd3b\\x2df2a12c454613', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:78|80|91|92|174|176|187|188|241|243|254|255|274|278|279, test/fixtures/content/items.json:1127|1129|1140|1141|1223|1225|1236|1237|1290|1292|1303|1304|1323|1327|1328
			'6da31a37\\x2d691f\\x2d4908\\x2d896f\\x2d2829ebe2309e', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:95|97|157|159, test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:94|96|183|185, test/fixtures/content/items.json:615|617|704|706|1144|1146|1206|1208
			'08c3aeaf\\x2d259b\\x2d436a\\x2d83d9\\x2d7253c78540fc', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:112|114|192|194, test/fixtures/content/items.json:1161|1163|1241|1243
			'b1d025bc\\x2d56d5\\x2d4420\\x2dae8c\\x2d49c0c02cc816', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:134|136|214|216, test/fixtures/content/items.json:1183|1185|1263|1265
			'b16fce7e\\x2d3c92\\x2d48a3\\x2dace0\\x2dd1af3fce71af', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:2|3|8|47|78|163|164|165, test/fixtures/content/items.json:846|847|852|891|922|1007|1008|1009, test/server/controllers/resolve.spec.js:34|87|88|108|109|279, test/server/lib/download/index.spec.js:38, test/server/lib/download/video.spec.js:52, test/server/lib/enrich/index.js:28, test/server/lib/enrich/video.js:28, test/server/lib/get-content-by-id.spec.js:110|167, test/server/lib/get-content.spec.js:25
			'749cb87e\\x2d6ca8\\x2d11e7\\x2db9c7\\x2d15af748b60d0', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:16|17, test/fixtures/content/items.json:860|861
			'dddf09c6\\x2d77a8\\x2d11e7\\x2da3e8\\x2d60495fe6ca71', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:20|21, test/fixtures/content/items.json:864|865
			'd9d59684\\x2d6ca3\\x2d11e7\\x2dbfeb\\x2d33fe0c5b7eaa', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:24|25, test/fixtures/content/items.json:868|869
			'398df8c0\\x2d67b1\\x2d11e7\\x2d8526\\x2d7b38dcaef614', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:28|29, test/fixtures/content/items.json:872|873
			'7156ce33\\x2d3a5a\\x2d43b9\\x2d83ce\\x2d2206337d2784', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:80|192, test/fixtures/content/items.json:924|1036
			'596c35ec\\x2dbdb3\\x2d409a\\x2d83fb\\x2d717ecd3dc029', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:90|92|124|126, test/fixtures/content/items.json:934|936|968|970
			'c47f4dfc\\x2d6879\\x2d4e95\\x2daccf\\x2dca8cbe6a1f69', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:107|109|146|148|178, test/fixtures/content/items.json:951|953|990|992|1022
			'b6e54ea4\\x2d86c4\\x2d11e7\\x2d8bb1\\x2d5ba57d47eff7', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:2|3|6|55|56|244|248|249, test/fixtures/content/es/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:2|14|18|19|25|26, test/fixtures/s3-events/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.create.json:14, test/fixtures/s3-events/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.delete.json:14, test/fixtures/translations/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:2, test/server/controllers/translations.spec.js:32|36, test/server/lib/resolve/lang/es/previewText.spec.js:31, test/worker/sync/content-es/upsert-content.spec.js:51|57|73|84|96|105
			'a912eb98\\x2d8759\\x2d11e7\\x2dbf50\\x2de1c239b45787', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:31|37
			'df5190e2\\x2d20f9\\x2d379b\\x2d9054\\x2d06ecfbdcb3a0', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:59|61|210|212
			'852939c8\\x2d859c\\x2d361e\\x2d8514\\x2df82f6c041580', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:93|95
			'5ea997c8\\x2d1de2\\x2d3add\\x2d8e63\\x2d8639fc2459c9', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:110|112
			'e569e23b\\x2d0c3e\\x2d3d20\\x2d8ed0\\x2d4c17b8177c05', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:126|128|138|140
			'8a086a54\\x2dea48\\x2d3a52\\x2dbd3c\\x2d5821430c2132', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:143|145
			'8a9d1cd8\\x2df4da\\x2d38d6\\x2da4eb\\x2d195d6a41d902', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:159|161
			'2dd66dcb\\x2db87d\\x2d35ef\\x2db1bf\\x2dce8706f2c382', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:176|178
			'b83df96a\\x2d67c7\\x2d3618\\x2d9fc1\\x2ddb357bf775eb', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:193|195|204|206|228|230|239|241
			'ef4c49fe\\x2d980e\\x2d11e7\\x2db83c\\x2d9588e51488a0', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:2|3|10|71|72|246|247|248, test/fixtures/content/items.json:521|522|529|592|593|767|768|769, test/server/controllers/resolve.spec.js:33|66|67|265, test/server/lib/enrich/article.js:24, test/server/lib/enrich/index.js:27, test/server/lib/get-content-by-id.spec.js:48, test/server/lib/get-content.spec.js:24
			'ecdc60f0\\x2d97dc\\x2d11e7\\x2da652\\x2dcde3f882dd7b', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:38|49|50|55|59|68|69|288, test/fixtures/content/items.json:559|570|571|576|580|589|590|809
			'84cf4073\\x2da674\\x2d4a93\\x2daef9\\x2ddcc1832a65cb', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:76|78|90|91, test/fixtures/content/items.json:597|599|611|612
			'0b83bc44\\x2d4a55\\x2d4958\\x2d882e\\x2d73ba6b2b0aa6', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:111|113, test/fixtures/content/items.json:632|634
			'f12aa89a\\x2d5506\\x2d4a68\\x2daff6\\x2d4ce78d0e709f', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:127|129|228|230|275, test/fixtures/content/items.json:648|650|749|751|796
			'6b32f2c1\\x2dda43\\x2d4e19\\x2d80b9\\x2d8aef4ab640d7', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:144|146, test/fixtures/content/items.json:665|667
			'14c63939\\x2d4e28\\x2d4aaa\\x2dbf44\\x2daf570a20990e', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:160|162|201|203|261, test/fixtures/content/items.json:681|683|722|724|782
			'f743871c\\x2d3499\\x2d4844\\x2d9d2b\\x2d685fcd94f9c7', // test/fixtures/contractResponse.json:15|106|138
			'f743871c\\x2d3499\\x2d4844\\x2d9d2b\\x2d685fcd94f9c8', // test/fixtures/contractResponse.json:46|75|170|200|230|260
			'd7bf1822\\x2dec58\\x2d4a8e\\x2da669\\x2d5cbcc0d6a1b2', // test/fixtures/d7bf1822-ec58-4a8e-a669-5cbcc0d6a1b2.json:2|12|56
			'de2390cd\\x2d46a1\\x2d4c58\\x2d2914\\x2df5f50e13f766', // test/fixtures/d7bf1822-ec58-4a8e-a669-5cbcc0d6a1b2.json:14
			'dbe4928a\\x2d5bec\\x2d11e7\\x2db553\\x2de2df1b0c3220', // test/fixtures/dbe4928a-5bec-11e7-b553-e2df1b0c3220.json:2|12|20, test/server/controllers/export.spec.js:124|135, test/server/controllers/resolve.spec.js:139
			'72281190\\x2d5be8\\x2d11e7\\x2d2b35\\x2d7545c1789969', // test/fixtures/dbe4928a-5bec-11e7-b553-e2df1b0c3220.json:4|14
			'8ef593a8\\x2deef6\\x2d448c\\x2d8560\\x2d9ca8cdca80a6', // test/fixtures/google-spreadsheet.json:19
			'd4efba32\\x2dd2ca\\x2d11e6\\x2db06b\\x2d680c49b4b4c0', // test/fixtures/s3-events/d4efba32-d2ca-11e6-b06b-680c49b4b4c0.create.json:14, test/fixtures/s3-events/d4efba32-d2ca-11e6-b06b-680c49b4b4c0.delete.json:14, test/fixtures/translations/d4efba32-d2ca-11e6-b06b-680c49b4b4c0.json:2
			'167e9de0f286d5d771a89b864c053ea8', // test/health/db-backups.spec.js:40|40
			'095ffdbf50ee4041ee18ed9077216844', // test/server/controllers/export.spec.js:39|39, test/server/controllers/resolve.spec.js:41|41, test/server/lib/get-all-existing-items-for-contract.spec.js:28|28
			'6feabf0d4eed16682bfbd6d3560a45ee', // test/server/controllers/export.spec.js:59|59, test/server/controllers/resolve.spec.js:62|62, test/server/lib/get-all-existing-items-for-contract.spec.js:47|47
			'b2697f93\\x2d52d3\\x2d4d42\\x2d8409\\x2dbdf91b09e894', // test/server/controllers/export.spec.js:62|82|104|123, test/server/controllers/resolve.spec.js:65|86|107|127, test/server/lib/get-all-existing-items-for-contract.spec.js:50|69|88|106
			'8d1beddb5cc7ed98a61fc28934871b35', // test/server/controllers/export.spec.js:79|79|101|101, test/server/controllers/resolve.spec.js:83|83|104|104, test/server/lib/get-all-existing-items-for-contract.spec.js:66|66|85|85
			'ee0981e4bebd818374a6c1416029656f', // test/server/controllers/export.spec.js:120|120, test/server/controllers/resolve.spec.js:124|124, test/server/lib/get-all-existing-items-for-contract.spec.js:103|103
			'0aaee458\\x2d6c6e\\x2d11e7\\x2dbfeb\\x2d33fe0c5b7eaa', // test/server/controllers/history.spec.js:45|117|127|135|140, test/server/lib/get-history-by-contract-id.spec.js:40
			'f55885427fa5f8c3e2b90204a6e6b0c7', // test/server/controllers/history.spec.js:52|52, test/server/lib/get-history-by-contract-id.spec.js:47|47
			'74447ca2\\x2d6b0b\\x2d11e7\\x2dbfeb\\x2d33fe0c5b7eaa', // test/server/controllers/history.spec.js:59|143|156|164|169, test/server/lib/get-history-by-contract-id.spec.js:54
			'4eff4aba81093b44d2a71c36fc8e9898', // test/server/controllers/history.spec.js:65|65, test/server/lib/get-history-by-contract-id.spec.js:60|60
			'eaef2e2c\\x2d6c61\\x2d11e7\\x2db9c7\\x2d15af748b60d0', // test/server/controllers/history.spec.js:72|172|182|190|195, test/server/lib/get-history-by-contract-id.spec.js:67
			'c71c4e6cf5183996a34235bf50bc0e1d', // test/server/controllers/history.spec.js:78|78, test/server/lib/get-history-by-contract-id.spec.js:73|73
			'ef05ef34\\x2d653e\\x2d11e7\\x2d0400\\x2d0461ef5f0ab7', // test/server/controllers/history.spec.js:93|103
			'55c4033a\\x2d6c6c\\x2d11e7\\x2d27a1\\x2d8235aeffcb99', // test/server/controllers/history.spec.js:119|129
			'5558218c\\x2d6baa\\x2d11e7\\x2d218d\\x2da464d62fd5e3', // test/server/controllers/history.spec.js:145|158
			'a6652138\\x2d6c68\\x2d11e7\\x2d27a1\\x2d8235aeffcb99', // test/server/controllers/history.spec.js:174|184
			'7324539d\\x2dcf00\\x2d4164\\x2db0b2\\x2de6ffb9a6b791', // test/server/helpers/array-to-map.spec.js:17|18
			'066a1263\\x2dbdc6\\x2d41ee\\x2d867d\\x2d7d0bad397b14', // test/server/helpers/array-to-map.spec.js:22|23
			'71f15834\\x2dc2f3\\x2d474b\\x2d846d\\x2d5779bcaf9753', // test/server/helpers/array-to-map.spec.js:27|28
			'02c03200\\x2d86dc\\x2d11e7\\x2dbf50\\x2de1c239b45787', // test/server/lib/get-all-existing-items-for-contract.spec.js:32|43|70|80|89|99
			'491cf75e\\x2d51d2\\x2d11e7\\x2da1f2\\x2ddb19572361bb', // test/server/lib/get-all-existing-items-for-contract.spec.js:51|62
			'b3ec55b0\\x2d7dd4\\x2d11e7\\x2d9108\\x2dedda0bcbc928', // test/server/lib/get-all-existing-items-for-contract.spec.js:107|117
			'fakenews\\x2dfa2b\\x2d46b5\\x2d886f\\x2d1418c6445182', // test/server/lib/get-content-by-id.spec.js:217
			'fakenews\\x2d3f7e\\x2d11e7\\x2d9d56\\x2d25f963e998b2', // test/server/lib/get-content-by-id.spec.js:218
			'fakenews\\x2d1d31\\x2d39fd\\x2d82f0\\x2dba1822ef20d2', // test/server/lib/get-content-by-id.spec.js:219
			'fakenews\\x2dec58\\x2d4a8e\\x2da669\\x2d5cbcc0d6a1b2' // test/server/lib/get-content-by-id.spec.js:220
		]
	}
};
