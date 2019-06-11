/*
 * @Description: 文章接口
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-04-15 10:21:15
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-06-10 22:58:10
 */

const article = require('../models/article');

/**
 * 添加文章接口 API
 * @param {Object} ctx
 */
async function insertArticle(ctx) {
	try {
		let { title, desc, banner, tag, content, catg } = ctx.request.body;
		await article
			.create({
				title,
				desc,
				banner,
				tag,
				content,
				catg,
			})
			.then(() => {
				ctx.body = {
					code: 1,
					error: 0,
					msg: '添加文章成功',
				};
			});
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '添加文章失败',
			err,
		};
	}
}

/**
 * 获取文章列表接口 API
 * @param {Object} ctx
 */
async function articleList(ctx) {
	try {
		let data = ctx.request.body;
		let page = parseInt((data.curPage - 1) * data.limit);
		let pageSize = parseInt(data.limit);
		let artData = await article
			.aggregate([
				{
					$project: {
						id: '$id',
						title: '$title',
						desc: '$desc',
						banner: '$banner',
						tag: '$tag',
						content: '$content',
						catg: '$catg',
						cdate: {
							$dateToString: {
								format: '%Y-%m-%d %H:%M:%S',
								date: '$cdate',
							},
						},
						status: '$status',
					},
				},
			])
			.skip(page)
			.limit(pageSize)
			.sort({
				id: -1, //降序排列
			});
		let total = await article.count({});
		ctx.body = {
			code: 1,
			error: 0,
			artData,
			total,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取文章列表失败',
			err,
		};
	}
}

/**
 * 编辑文章接口API
 * @param {Object} ctx
 */
async function editArticle(ctx) {
	try {
		let { id, title, desc, banner, tag, content, catg } = ctx.request.body;
		await article
			.updateOne(
				{
					id: id,
				},
				{
					$set: {
						title,
						desc,
						banner,
						tag,
						content,
						catg,
					},
				}
			)
			.then(() => {
				ctx.body = {
					code: 1,
					error: 0,
					msg: '编辑文章成功',
				};
			});
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '编辑文章失败',
			err,
		};
	}
}

/**
 * 获取文章详情接口API
 * @param {Object} ctx
 */
async function getArtDetl(ctx) {
	try {
		let { id } = ctx.request.body;
		let ArtDetlData = await article.findOne(
			{
				id: id,
			},
			{
				__v: 0,
				status: 0,
			}
		);
		ctx.body = {
			code: 1,
			error: 0,
			msg: '获取文章详情成功',
			ArtDetlData,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取文章详情失败',
			err,
		};
	}
}

/**
 * 删除文章接口API
 * @param {Object} ctx
 */
async function delArticle(ctx) {
	try {
		let { id } = ctx.request.body;
		await article
			.deleteOne({
				id: id,
			})
			.then(() => {
				ctx.body = {
					code: 1,
					error: 0,
					msg: '删除文章成功',
				};
			});
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '删除文章失败',
			err,
		};
	}
}

/**
 * 改变文章状态接口API
 * @param {Object} ctx
 */
async function chgArtStatus(ctx) {
	try {
		let { id, status } = ctx.request.body;
		await article
			.updateOne(
				{
					id: id,
				},
				{
					$set: {
						status,
					},
				}
			)
			.then(() => {
				ctx.body = {
					code: 1,
					error: 0,
					msg: '改变文章状态成功',
				};
			});
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '改变文章状态失败',
			err,
		};
	}
}

/**
 * 指定状态文章列表接口API
 * @param {Object} ctx
 */
async function artAllList(ctx) {
	try {
		let artListData = await article.aggregate([
			{
				$match: {
					status: 1,
				},
			},
			{
				$project: {
					id: '$_id',
					uid: '$id',
					title: '$title',
					cdate: {
						$dateToString: {
							format: '%Y-%m-%d %H:%M:%S',
							date: '$cdate',
						},
					},
					_id: 0,
				},
			},
			{
				$sort: {
					id: -1,
				},
			},
		]);
		let artTotalData = await article.countDocuments({
			status: '1',
		});
		ctx.body = {
			code: 1,
			error: 0,
			msg: '获取文章列表成功',
			artListData,
			artTotalData,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取文章列表失败',
			err,
		};
	}
}

/**
 * 指定状态和limit文章列表接口API
 * @param {Object} ctx
 */
async function getallAtrApplet(ctx) {
	try {
		let data = ctx.request.body;
		let page = parseInt(data.allPage * 5);
		let artList = await article.aggregate([
			{
				$match: {
					status: 1,
				},
			},
			{
				$project: {
					id: '$id',
					title: '$title',
					desc: '$desc',
					catg: '$catg',
					pv: '$pv',
					cdate: {
						$dateToString: {
							format: '%Y年%m月%d日',
							date: '$cdate',
						},
					},
					_id: 0,
				},
			},
			{
				$lookup: {
					from: 'users',
					pipeline: [{ $match: { name: 'MoonCheung' } }, { $project: { _id: 0, introduction: 0, username: 0, password: 0, roles: 0 } }],
					as: 'myAuthor',
				},
			},
			//$unwind将操作数视为单个元素数组，其中数组的由对象字段的值替换。
			{ $unwind: '$myAuthor' },
			{ $skip: page },
			{
				$limit: 5,
			},
			{
				$sort: {
					id: -1, //降序排列
				},
			},
		]);
		ctx.body = {
			code: 1,
			error: 0,
			msg: '获取所有文章列表成功',
			artList,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取所有文章列表失败',
			err,
		};
	}
}

/**
 * 指定ID文章详情接口API
 * @param {Object} ctx
 */
async function getArtDeilApplet(ctx) {
	try {
		let data = ctx.request.query;
		let ArtDeilData = await article.findOneAndUpdate(
			{
				id: data.id,
			},
			{
				//$inc运算符按指定值递增
				$inc: { pv: 1 },
			},
			{
				projection: {
					__v: 0,
					_id: 0,
					desc: 0,
					banner: 0,
					status: 0,
				},
				returnNewDocument: true,
			}
		);
		ctx.body = {
			code: 1,
			error: 0,
			ArtDeilData,
			msg: '获取文章详情成功',
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取文章详情失败',
			err,
		};
	}
}

/**
 * 指定分类文章接口API
 * @param {Object} ctx
 */
async function getApptCatgApplet(ctx) {
	try {
		let data = ctx.request.body;
		let page = parseInt(data.curPage * 5);
		let apptArtList = await article.aggregate([
			{
				$match: {
					status: 1,
					catg: data.catg,
				},
			},
			{
				$project: {
					id: '$id',
					title: '$title',
					desc: '$desc',
					catg: '$catg',
					pv: '$pv',
					cdate: {
						$dateToString: {
							format: '%Y年%m月%d日',
							date: '$cdate',
						},
					},
					_id: 0,
				},
			},
			{
				$lookup: {
					from: 'users',
					pipeline: [{ $match: { name: 'MoonCheung' } }, { $project: { _id: 0, introduction: 0, username: 0, password: 0, roles: 0 } }],
					as: 'apptAuthor',
				},
			},
			//$unwind将操作数视为单个元素数组，其中数组的由对象字段的值替换。
			{ $unwind: '$apptAuthor' },
			{ $skip: page },
			{
				$limit: 5,
			},
			{
				$sort: {
					id: -1, //降序排列
				},
			},
		]);
		ctx.body = {
			code: 1,
			error: 0,
			msg: '获取指定分类文章成功',
			apptArtList,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取指定分类文章失败',
			err,
		};
	}
}

async function addLikeArtApplet(ctx) {
	try {
		let data = ctx.request.body;
		await article.updateOne(
			{
				id: data.id,
			},
			{
				$set: { like: data.like },
			}
		);
		ctx.body = {
			code: 1,
			error: 0,
			msg: '增加指定文章点赞成功',
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '增加指定文章点赞失败',
			err,
		};
	}
}

async function delLikeArtApplet(ctx) {
	try {
		let data = ctx.request.body;
		await article.updateOne(
			{
				id: data.id,
			},
			{
				$set: { like: data.like },
			}
		);
		ctx.body = {
			code: 1,
			error: 0,
			msg: '删除指定文章点赞成功',
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '删除指定文章点赞失败',
			err,
		};
	}
}

module.exports = {
	insertArticle,
	articleList,
	editArticle,
	getArtDetl,
	delArticle,
	chgArtStatus,
	artAllList,
	getallAtrApplet,
	getArtDeilApplet,
	getApptCatgApplet,
	addLikeArtApplet,
	delLikeArtApplet,
};
