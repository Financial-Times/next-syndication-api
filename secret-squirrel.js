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
			'a0b1c2d3-e4f5-g6h7-i9j0-k1l2m3n4o5p6', // doc/README.md:49|82
			'z0y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4', // doc/README.md:51
			'c3e9b81a-c477-11e7-b2bb-322b2cb39656', // doc/README.md:162|174
			'a22ff86e-ba37-11e7-9bfb-4a9c83ffa852', // doc/README.md:163|189
			'40a86de6-b5dd-11e7-a398-73d59db9e399', // doc/README.md:245|258
			'081b2240-ae7e-11e7-aab9-abaa44b1e130', // doc/README.md:272|285
			'286ad07a-c415-11e7-b2bb-322b2cb39656', // doc/README.md:319|330|341|345|346|383|411|441
			'9d5272af0a36ca429249c25899a64f88', // doc/README.md:481|481
			'b2697f93-52d3-4d42-8409-bdf91b09e894', // doc/README.md:484|517, test/server/controllers/export.spec.js:61|80|101|119, test/server/controllers/resolve.spec.js:65|86|107|127, test/server/lib/get-all-existing-items-for-contract.spec.js:50|69|88|106
			'315daef2-b1c1-11e7-aa26-bb002965bce8', // doc/README.md:485|495|499
			'45bd7ff4e01052bb77a839766e1e69d9', // doc/README.md:514|514
			'eb5982b4-b3ff-11e7-a398-73d59db9e399', // doc/README.md:518|528|532
			'1166b19b-7ad0-4cf7-a679-3cfa3a618d76', // doc/SYNDICATION.md:137
			'5ab2ecac-3235-4aa0-a325-f71526ace32b', // doc/SYNDICATION.md:141
			'6b57996f-8927-416a-8d25-deeb76755798', // doc/SYNDICATION.md:145
			'8ef593a8-eef6-448c-8560-9ca8cdca80a5', // doc/troubleshooting.md:14, test/db/pg/map-columns.spec.js:80|99|102, test/fixtures/google-spreadsheet.json:11, test/fixtures/licenceUsers.json:8, test/fixtures/userResponse.json:2, test/server/controllers/export.spec.js:42, test/server/controllers/history.spec.js:34|48|62|75|222|338|457|576, test/server/controllers/resolve.spec.js:44, test/server/controllers/translations.spec.js:50|153|311|469|629|793, test/server/controllers/unsave-by-content-id.spec.js:37|150, test/server/lib/get-all-existing-items-for-contract.spec.js:31, test/server/lib/get-history-by-contract-id.spec.js:29|43|57|70|135, test/server/middleware/check-if-new-syndication-user.spec.js:29, test/server/middleware/get-contract-by-id-from-session.spec.js:99|101|185|187, test/server/middleware/get-users-for-licence.spec.js:113
			'4d31c9e5-eafe-4639-bba0-24d7a488b08f', // runbook.md:47
			'john\\.q@average\\.com', // test/db/pg/map-columns.spec.js:27, test/fixtures/contractProfile.json:7
			'0c56a4f2-6bc5-11e7-bfeb-33fe0c5b7eaa', // test/db/pg/map-columns.spec.js:76|95, test/server/controllers/history.spec.js:31|91|101|109|114, test/server/lib/get-history-by-contract-id.spec.js:26
			'c3391af1-0d46-4ddc-a922-df7c49cf1552', // test/db/pg/map-columns.spec.js:84|104, test/server/controllers/history.spec.js:36|50|64|77|277|395|514|633, test/server/controllers/translations.spec.js:114|222|380|540|698|862, test/server/lib/get-history-by-contract-id.spec.js:31|45|59|72
			'9807a4b6dcb3ce1188593759dd6818cd', // test/db/pg/map-columns.spec.js:86|86|106|106, test/server/controllers/history.spec.js:38|38, test/server/controllers/unsave-by-content-id.spec.js:32|32|145|145, test/server/lib/get-history-by-contract-id.spec.js:33|33
			'foo@bar\\.com', // test/db/toPutItem.spec.js:69, test/queue/message-queue-event.spec.js:86|143|181|226|260|292|330|375, test/queue/publish.spec.js:98, test/server/controllers/download-by-content-id.spec.js:97|187, test/server/controllers/export.spec.js:189|267, test/server/controllers/save-by-content-id.spec.js:94, test/server/controllers/unsave-by-content-id.spec.js:111|222, test/server/controllers/update-download-format.spec.js:75|93|109, test/server/controllers/user-status.spec.js:97|127, test/worker/persist.spec.js:44, test/worker/sync/db-persist/mail-contributor.spec.js:76|159, test/worker/sync/db-persist/spoor-publish.spec.js:75, test/worker/sync/db-persist/upsert-history.spec.js:60
			'2778b97a-5bc9-11e7-9bc8-8055f264aa8b', // test/fixtures/2778b97a-5bc9-11e7-9bc8-8055f264aa8b.json:2|12|20
			'0592f436-5c0c-11e7-2b35-7545c1789969', // test/fixtures/2778b97a-5bc9-11e7-9bc8-8055f264aa8b.json:4|14
			'dbb0bdae-1f0c-11e4-b0cb-b2227cce2b54', // test/fixtures/2778b97a-5bc9-11e7-9bc8-8055f264aa8b.json:13, test/fixtures/80d634ea-fa2b-46b5-886f-1418c6445182.json:12, test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:13, test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:15, test/fixtures/d7bf1822-ec58-4a8e-a669-5cbcc0d6a1b2.json:13, test/fixtures/dbe4928a-5bec-11e7-b553-e2df1b0c3220.json:13, test/server/controllers/history.spec.js:102|128|157|183, test/server/lib/decorate-article.spec.js:26
			'80d634ea-fa2b-46b5-886f-1418c6445182', // test/fixtures/80d634ea-fa2b-46b5-886f-1418c6445182.json:2|11|53, test/server/lib/resolve/id.spec.js:15
			'd0842750-9903-4bf9-2ee7-f3d98afabc1e', // test/fixtures/80d634ea-fa2b-46b5-886f-1418c6445182.json:13
			'b59dff10-3f7e-11e7-9d56-25f963e998b2', // test/fixtures/article.html:6, test/fixtures/article.plain:12, test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:2|12|20, test/server/controllers/export.spec.js:62|73, test/server/controllers/resolve.spec.js:78, test/server/controllers/save-by-content-id.spec.js:30, test/server/lib/convert-article.spec.js:15, test/server/lib/decorate-article.spec.js:15|25|33, test/server/lib/to-plain-text.spec.js:22|30
			'16a642f4-3f84-11e7-1cd0-1ef14f87a411', // test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:4|14, test/server/lib/decorate-article.spec.js:17|27
			'faf86fbc-0009-11df-8626-00144feabdc0', // test/fixtures/b59dff10-3f7e-11e7-9d56-25f963e998b2.json:21, test/server/lib/decorate-article.spec.js:34, test/server/lib/get-word-count.spec.js:61
			'c7923fba-1d31-39fd-82f0-ba1822ef20d2', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:2|12, test/server/controllers/export.spec.js:43|54|81|92|102|112, test/server/controllers/resolve.spec.js:57|98|119
			'34b704a0-54d7-11e7-9fed-c19e2700005f', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:4|5
			'b4fac748-a2b1-4b7d-8e1f-03ba743ff717', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:14
			'00004ffc-004e-50ad-0337-456ae1b1861c', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:17
			'6ce05235-c102-48b9-a886-95dbd7f40419', // test/fixtures/c7923fba-1d31-39fd-82f0-ba1822ef20d2.json:19
			'42ad255a-99f9-11e7-b83c-9588e51488a0', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:2|3|10|86|87|452|453|454, test/fixtures/content/items.json:3|4|11|87|88|453|454|455, test/server/controllers/download-by-content-id.spec.js:38, test/server/controllers/resolve.spec.js:32|45|46|247, test/server/controllers/unsave-by-content-id.spec.js:35|36|58|65|66|67|78|80|82|85|148|149|167|174|175|176|188|190|192|195, test/server/lib/download/article.spec.js:47, test/server/lib/download/index.spec.js:37, test/server/lib/enrich/article.js:23, test/server/lib/enrich/index.js:25, test/server/lib/get-content-by-id.spec.js:47, test/server/lib/get-content.spec.js:23
			'd2638930-7db3-11e7-ab01-a13271d1ee9c', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:38|49|50|56|60|84|85|481, test/fixtures/content/items.json:39|50|51|57|61|85|86|482
			'69837688-9a04-11e7-b83c-9588e51488a0', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:68|69|71|75, test/fixtures/content/items.json:69|70|72|76
			'ad26302e-9879-11e7-8c5c-c8d8fa6961bb', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:95, test/fixtures/content/items.json:96
			'de3e1832-97cc-11e7-b83c-9588e51488a0', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:102|113|116, test/fixtures/content/items.json:103|114|117
			'19b95057-4614-45fb-9306-4d54049354db', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:120, test/fixtures/content/items.json:121
			'0501c122-995c-11e7-8c5c-c8d8fa6961bb', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:132, test/fixtures/content/items.json:133
			'd17153e9-f07d-49ad-8dbd-4cb23d6bbc9b', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:139|143|144|207|211|212, test/fixtures/content/items.json:140|144|145|208|212|213
			'd43c7982-97d1-11e7-b83c-9588e51488a0', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:146|157|160, test/fixtures/content/items.json:147|158|161
			'1d556016-ad16-4fe7-8724-42b3fb15ad28', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:164, test/fixtures/content/items.json:165
			'b9d7e924-996a-11e7-8c5c-c8d8fa6961bb', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:182, test/fixtures/content/items.json:183
			'6a21c3e0-995c-11e7-a652-cde3f882dd7b', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:189|200|203, test/fixtures/content/items.json:190|201|204
			'6b683eff-56c3-43d9-acfc-7511d974fc01', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:222|224, test/fixtures/content/items.json:223|225
			'04126152-5bef-4dda-86bf-81f66c00a342', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:238|240, test/fixtures/content/items.json:239|241
			'c91b1fad-1097-468b-be82-9a8ff717d54c', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:254|256, test/fixtures/content/items.json:255|257
			'f7428da5-c1d2-35d7-abef-95be5f382b78', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:270|272|282|283, test/fixtures/content/items.json:271|273|283|284
			'a579350c-61ce-4c00-97ca-ddaa2e0cacf6', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:286|288|299|300|374|376|387|388, test/fixtures/content/items.json:287|289|300|301|375|377|388|389
			'466a4700-307f-47cc-83f1-c5f97a172232', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:303|305|315|316|435|437|447|448|467|471|472, test/fixtures/content/items.json:304|306|316|317|436|438|448|449|468|472|473
			'dd4b519f-e896-4322-8f77-25c936eb9d32', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:319|321|392|394, test/fixtures/content/items.json:320|322|393|395
			'33b4cf11-6854-4dc5-aadb-f0a671da0753', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:335|337|408|410, test/fixtures/content/items.json:336|338|409|411
			'049291ca-c558-4b3d-ac99-cdc2e19dfc46', // test/fixtures/content/42ad255a-99f9-11e7-b83c-9588e51488a0.json:357|359, test/fixtures/content/items.json:358|360
			'52be3c0c-7831-11e7-a3e8-60495fe6ca71', // test/fixtures/content/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:2|3|6|38|39|58, test/fixtures/content/es/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:2|14|18|19|25|26, test/server/controllers/translations.spec.js:31|35, test/server/lib/resolve/lang/es/previewText.spec.js:23
			'32d8f4b0-5d58-434d-b578-337486e9f714', // test/fixtures/content/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:11
			'260b270a-723d-11e7-93ff-99f383b09ff9', // test/fixtures/content/52be3c0c-7831-11e7-a3e8-60495fe6ca71.json:28
			'93991a3c-0436-41bb-863e-61242e09859c', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:2|21|22, test/fixtures/content/items.json:1491|1510|1511, test/server/controllers/resolve.spec.js:37|317, test/server/lib/enrich/index.js:30, test/server/lib/enrich/podcast.js:28, test/server/lib/get-content-by-id.spec.js:113|170, test/server/lib/get-content.spec.js:28
			'thehitsthatshooktheworld', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:3|26, test/fixtures/content/items.json:1492|1515
			'72ecae21-af5a-46db-914c-f8072d342bd2', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:31|32|100|101|117|118, test/fixtures/content/items.json:1520|1521|1589|1590|1606|1607
			'1d3f86a4-4df8-3652-adfc-dcae9e6645a5', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:43|45|111|113|129|131, test/fixtures/content/items.json:1532|1534|1600|1602|1618|1620
			'02afce67-6a86-3e49-8425-5f026b0d9be4', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:48|49, test/fixtures/content/items.json:1537|1538
			'f967910f-67d5-31f7-a031-64f8af0d9cf1', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:65|66, test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:76|78, test/fixtures/content/items.json:1554|1555
			'bea65a67-c2e3-3488-820a-5c21074b34e5', // test/fixtures/content/93991a3c-0436-41bb-863e-61242e09859c.json:82|83, test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:82|83, test/fixtures/content/items.json:1428|1429|1571|1572
			'98b46b5f-17d3-40c2-8eaa-082df70c5f01', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:2|21|22, test/fixtures/content/items.json:1348|1367|1368, test/server/controllers/resolve.spec.js:36|303, test/server/lib/download/index.spec.js:39, test/server/lib/download/podcast.spec.js:52, test/server/lib/enrich/index.js:29, test/server/lib/enrich/podcast.js:27, test/server/lib/get-content-by-id.spec.js:112|169, test/server/lib/get-content.spec.js:27
			'1ccd0d9f-8849-32a6-941a-0d37e1001603', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:31|32|100|101|117|118, test/fixtures/content/items.json:1377|1378|1446|1447|1463|1464
			'dee66cf5-5374-4674-9f70-90cccbc9604a', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:43|45|111|113|129|131, test/fixtures/content/items.json:1389|1391|1457|1459|1475|1477
			'd969d76e-f8f4-34ae-bc38-95cfd0884740', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:48|49, test/fixtures/content/items.json:1394|1395
			'89d15f70-640d-11e4-9803-0800200c9a66', // test/fixtures/content/98b46b5f-17d3-40c2-8eaa-082df70c5f01.json:65|66|77|79, test/fixtures/content/items.json:1411|1412|1423|1425
			'a1af0574-eafb-41bd-aa4f-59aa2cd084c2', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:2|3|8|35|66|259|260|261, test/fixtures/content/items.json:1047|1048|1053|1080|1111|1304|1305|1306, test/server/controllers/download-by-content-id.spec.js:115, test/server/controllers/resolve.spec.js:35|128|129|289, test/server/lib/enrich/index.js:28, test/server/lib/enrich/video.js:28, test/server/lib/get-content-by-id.spec.js:111|168, test/server/lib/get-content.spec.js:26
			'996fbb84-96d7-11e7-b83c-9588e51488a0', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:16|17, test/fixtures/content/items.json:1061|1062
			'3cf28f7f-78ff-4c1f-a197-896dea2a9595', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:68|288, test/fixtures/content/items.json:1113|1333
			'6d0d2fab-102e-32f8-bd3b-f2a12c454613', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:78|80|91|92|174|176|187|188|241|243|254|255|274|278|279, test/fixtures/content/items.json:1123|1125|1136|1137|1219|1221|1232|1233|1286|1288|1299|1300|1319|1323|1324
			'6da31a37-691f-4908-896f-2829ebe2309e', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:95|97|157|159, test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:94|96|183|185, test/fixtures/content/items.json:611|613|700|702|1140|1142|1202|1204
			'08c3aeaf-259b-436a-83d9-7253c78540fc', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:112|114|192|194, test/fixtures/content/items.json:1157|1159|1237|1239
			'b1d025bc-56d5-4420-ae8c-49c0c02cc816', // test/fixtures/content/a1af0574-eafb-41bd-aa4f-59aa2cd084c2.json:134|136|214|216, test/fixtures/content/items.json:1179|1181|1259|1261
			'b16fce7e-3c92-48a3-ace0-d1af3fce71af', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:2|3|8|47|78|163|164|165, test/fixtures/content/items.json:842|843|848|887|918|1003|1004|1005, test/server/controllers/resolve.spec.js:34|87|88|108|109|275, test/server/lib/download/index.spec.js:38, test/server/lib/download/video.spec.js:52, test/server/lib/enrich/index.js:27, test/server/lib/enrich/video.js:27, test/server/lib/get-content-by-id.spec.js:110|167, test/server/lib/get-content.spec.js:25
			'749cb87e-6ca8-11e7-b9c7-15af748b60d0', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:16|17, test/fixtures/content/items.json:856|857
			'dddf09c6-77a8-11e7-a3e8-60495fe6ca71', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:20|21, test/fixtures/content/items.json:860|861
			'd9d59684-6ca3-11e7-bfeb-33fe0c5b7eaa', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:24|25, test/fixtures/content/items.json:864|865
			'398df8c0-67b1-11e7-8526-7b38dcaef614', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:28|29, test/fixtures/content/items.json:868|869
			'7156ce33-3a5a-43b9-83ce-2206337d2784', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:80|192, test/fixtures/content/items.json:920|1032
			'596c35ec-bdb3-409a-83fb-717ecd3dc029', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:90|92|124|126, test/fixtures/content/items.json:930|932|964|966
			'c47f4dfc-6879-4e95-accf-ca8cbe6a1f69', // test/fixtures/content/b16fce7e-3c92-48a3-ace0-d1af3fce71af.json:107|109|146|148|178, test/fixtures/content/items.json:947|949|986|988|1018
			'b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:2|3|6|55|56|244|248|249, test/fixtures/content/es/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:2|14|18|19|25|26, test/fixtures/s3-events/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.create.json:14, test/fixtures/s3-events/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.delete.json:14, test/fixtures/translations/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:2, test/server/controllers/translations.spec.js:32|36, test/server/lib/resolve/lang/es/previewText.spec.js:31, test/worker/sync/content-es/upsert-content.spec.js:51|57|73|84|96|105
			'a912eb98-8759-11e7-bf50-e1c239b45787', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:31|37
			'df5190e2-20f9-379b-9054-06ecfbdcb3a0', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:59|61|210|212
			'852939c8-859c-361e-8514-f82f6c041580', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:93|95
			'5ea997c8-1de2-3add-8e63-8639fc2459c9', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:110|112
			'e569e23b-0c3e-3d20-8ed0-4c17b8177c05', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:126|128|138|140
			'8a086a54-ea48-3a52-bd3c-5821430c2132', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:143|145
			'8a9d1cd8-f4da-38d6-a4eb-195d6a41d902', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:159|161
			'2dd66dcb-b87d-35ef-b1bf-ce8706f2c382', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:176|178
			'b83df96a-67c7-3618-9fc1-db357bf775eb', // test/fixtures/content/b6e54ea4-86c4-11e7-8bb1-5ba57d47eff7.json:193|195|204|206|228|230|239|241
			'ef4c49fe-980e-11e7-b83c-9588e51488a0', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:2|3|10|71|72|246|247|248, test/fixtures/content/items.json:519|520|527|588|589|763|764|765, test/server/controllers/resolve.spec.js:33|66|67|261, test/server/lib/enrich/article.js:24, test/server/lib/enrich/index.js:26, test/server/lib/get-content-by-id.spec.js:48, test/server/lib/get-content.spec.js:24
			'ecdc60f0-97dc-11e7-a652-cde3f882dd7b', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:38|49|50|55|59|68|69|288, test/fixtures/content/items.json:555|566|567|572|576|585|586|805
			'84cf4073-a674-4a93-aef9-dcc1832a65cb', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:76|78|90|91, test/fixtures/content/items.json:593|595|607|608
			'0b83bc44-4a55-4958-882e-73ba6b2b0aa6', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:111|113, test/fixtures/content/items.json:628|630
			'f12aa89a-5506-4a68-aff6-4ce78d0e709f', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:127|129|228|230|275, test/fixtures/content/items.json:644|646|745|747|792
			'6b32f2c1-da43-4e19-80b9-8aef4ab640d7', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:144|146, test/fixtures/content/items.json:661|663
			'14c63939-4e28-4aaa-bf44-af570a20990e', // test/fixtures/content/ef4c49fe-980e-11e7-b83c-9588e51488a0.json:160|162|201|203|261, test/fixtures/content/items.json:677|679|718|720|778
			'f743871c-3499-4844-9d2b-685fcd94f9c7', // test/fixtures/contractResponse.json:15|106|138
			'f743871c-3499-4844-9d2b-685fcd94f9c8', // test/fixtures/contractResponse.json:46|75|170|200|230|260
			'd7bf1822-ec58-4a8e-a669-5cbcc0d6a1b2', // test/fixtures/d7bf1822-ec58-4a8e-a669-5cbcc0d6a1b2.json:2|12|56
			'de2390cd-46a1-4c58-2914-f5f50e13f766', // test/fixtures/d7bf1822-ec58-4a8e-a669-5cbcc0d6a1b2.json:14
			'dbe4928a-5bec-11e7-b553-e2df1b0c3220', // test/fixtures/dbe4928a-5bec-11e7-b553-e2df1b0c3220.json:2|12|20, test/server/controllers/export.spec.js:120|130, test/server/controllers/resolve.spec.js:139
			'72281190-5be8-11e7-2b35-7545c1789969', // test/fixtures/dbe4928a-5bec-11e7-b553-e2df1b0c3220.json:4|14
			'8ef593a8-eef6-448c-8560-9ca8cdca80a6', // test/fixtures/google-spreadsheet.json:19
			'd4efba32-d2ca-11e6-b06b-680c49b4b4c0', // test/fixtures/s3-events/d4efba32-d2ca-11e6-b06b-680c49b4b4c0.create.json:14, test/fixtures/s3-events/d4efba32-d2ca-11e6-b06b-680c49b4b4c0.delete.json:14, test/fixtures/translations/d4efba32-d2ca-11e6-b06b-680c49b4b4c0.json:2
			'167e9de0f286d5d771a89b864c053ea8', // test/health/db-backups.spec.js:40|40
			'095ffdbf50ee4041ee18ed9077216844', // test/server/controllers/export.spec.js:39|39, test/server/controllers/resolve.spec.js:41|41, test/server/lib/get-all-existing-items-for-contract.spec.js:28|28
			'6feabf0d4eed16682bfbd6d3560a45ee', // test/server/controllers/export.spec.js:58|58, test/server/controllers/resolve.spec.js:62|62, test/server/lib/get-all-existing-items-for-contract.spec.js:47|47
			'8d1beddb5cc7ed98a61fc28934871b35', // test/server/controllers/export.spec.js:77|77|98|98, test/server/controllers/resolve.spec.js:83|83|104|104, test/server/lib/get-all-existing-items-for-contract.spec.js:66|66|85|85
			'ee0981e4bebd818374a6c1416029656f', // test/server/controllers/export.spec.js:116|116, test/server/controllers/resolve.spec.js:124|124, test/server/lib/get-all-existing-items-for-contract.spec.js:103|103
			'0aaee458-6c6e-11e7-bfeb-33fe0c5b7eaa', // test/server/controllers/history.spec.js:45|117|127|135|140, test/server/lib/get-history-by-contract-id.spec.js:40
			'f55885427fa5f8c3e2b90204a6e6b0c7', // test/server/controllers/history.spec.js:52|52, test/server/lib/get-history-by-contract-id.spec.js:47|47
			'74447ca2-6b0b-11e7-bfeb-33fe0c5b7eaa', // test/server/controllers/history.spec.js:59|143|156|164|169, test/server/lib/get-history-by-contract-id.spec.js:54
			'4eff4aba81093b44d2a71c36fc8e9898', // test/server/controllers/history.spec.js:65|65, test/server/lib/get-history-by-contract-id.spec.js:60|60
			'eaef2e2c-6c61-11e7-b9c7-15af748b60d0', // test/server/controllers/history.spec.js:72|172|182|190|195, test/server/lib/get-history-by-contract-id.spec.js:67
			'c71c4e6cf5183996a34235bf50bc0e1d', // test/server/controllers/history.spec.js:78|78, test/server/lib/get-history-by-contract-id.spec.js:73|73
			'ef05ef34-653e-11e7-0400-0461ef5f0ab7', // test/server/controllers/history.spec.js:93|103
			'55c4033a-6c6c-11e7-27a1-8235aeffcb99', // test/server/controllers/history.spec.js:119|129
			'5558218c-6baa-11e7-218d-a464d62fd5e3', // test/server/controllers/history.spec.js:145|158
			'a6652138-6c68-11e7-27a1-8235aeffcb99', // test/server/controllers/history.spec.js:174|184
			'02c03200-86dc-11e7-bf50-e1c239b45787', // test/server/lib/get-all-existing-items-for-contract.spec.js:32|43|70|80|89|99
			'491cf75e-51d2-11e7-a1f2-db19572361bb', // test/server/lib/get-all-existing-items-for-contract.spec.js:51|62
			'b3ec55b0-7dd4-11e7-9108-edda0bcbc928', // test/server/lib/get-all-existing-items-for-contract.spec.js:107|117
			'fakenews-fa2b-46b5-886f-1418c6445182', // test/server/lib/get-content-by-id.spec.js:217
			'fakenews-3f7e-11e7-9d56-25f963e998b2', // test/server/lib/get-content-by-id.spec.js:218
			'fakenews-1d31-39fd-82f0-ba1822ef20d2', // test/server/lib/get-content-by-id.spec.js:219
			'fakenews-ec58-4a8e-a669-5cbcc0d6a1b2', // test/server/lib/get-content-by-id.spec.js:220
			'7324539d-cf00-4164-b0b2-e6ffb9a6b791', // test/server/helper/array-to-map.spec.js:17|18
			'066a1263-bdc6-41ee-867d-7d0bad397b14', // test/server/helper/array-to-map.spec.js:22|23
			'71f15834-c2f3-474b-846d-5779bcaf9753', // test/server/helper/array-to-map.spec.js:27|28
			'591a46cb-4551-4b05-9d49-f30250d9f0b0', // doc/syndication-api-postman.json
			'ec1fe89c-e687-417a-bf8e-012f4825e6cc', // doc/syndication-api-postman.json, a content ID
			'17620a3b-b82d-4b85-aa85-4cf2793b7a02', // doc/syndication-api-postman.json, a content ID
			'3fa5612f-042a-4ce1-9a5a-75292fd3ddef', // doc/syndication-api-postman.json, a content ID
		]
	}
};
