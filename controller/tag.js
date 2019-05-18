const tagModel = require('../models/tag');

/**
 * 添加标签API
 * @param {Object} ctx 
 */
async function addTag(ctx) {
  try {
    let {
      tagname,
      tagdesc
    } = ctx.request.body
    // let cdate = new Date().getTime();
    await tagModel.create({
      tagname,
      tagdesc
      // cdate
    }).then(() => {
      ctx.body = {
        code: 1,
        error: 0,
        msg: '添加分类成功'
      }
    })
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加标签失败',
      err
    }
  }
}

/**
 * 获取标签列表API
 * @param {Object} ctx 
 */
async function getTag(ctx) {
  try {
    let data = ctx.request.body //curPage: 1, limit: 10
    let page = parseInt((data.curPage - 1) * data.limit)
    let pageSize = parseInt(data.limit);
    let tagsData = await tagModel.aggregate([{
      $project: {
        id: "$_id", //将_id映射成id
        tagname: "$tagname",
        tagdesc: "$tagdesc",
        cdate: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$cdate"
          }
        },
        _id: 0
      }
    }]).skip(page).limit(pageSize).sort({
      _id: -1
    })
    let total = await tagModel.count({});
    ctx.body = {
      error: 0,
      tagsData,
      total
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取标签失败',
      err
    }
  }
}

/**
 * 编辑标签API
 * @param {Object} ctx
 */
async function editTag(ctx) {
  try {
    let {
      id,
      tagname,
      tagdesc
    } = ctx.request.body;
    await tagModel.updateOne({
      _id: id
    }, {
      $set: {
        tagname,
        tagdesc
      }
    }).then(() => {
      ctx.body = {
        code: 1,
        error: 0,
        msg: '编辑标签成功'
      }
    })
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '编辑标签失败',
      err
    }
  }
}

/**
 * 删除标签 API
 * @param {Object} ctx
 */
async function delTag(ctx) {
  try {
    let {
      id
    } = ctx.request.body;
    await tagModel.deleteOne({
      _id: id
    }).then(() => {
      ctx.body = {
        code: 1,
        error: 0,
        msg: '删除标签成功'
      }
    })
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '删除标签失败',
      err
    }
  }
}

/**
 * 获取所有标签 API (排除标签描述)
 * @param {Object} ctx
 */
async function getAllTag(ctx) {
  try {
    let result = await tagModel.find({}, {
      tagdesc: 0,
      __v: 0
    })
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有标签成功',
      result
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有标签失败',
      err
    }
  }
}

module.exports = {
  addTag,
  getTag,
  editTag,
  delTag,
  getAllTag
}