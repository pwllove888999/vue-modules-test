<template>
<div class="media">
  <el-row class="media-wrapper">
    <el-col :span="21" class="picture-main">
      <el-row class="title-row">
        <el-col :span="6" class="title-block">全部图片</el-col>
        <el-col :span="18" class="upload-block">
          <span>提示：图片大小不超过3M</span>
          <el-upload ref="upload" class="upload" action="http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture" :on-preview="handlePreview"
              :on-remove="handleRemove" :show-file-list="false" :file-list="fileList" :before-upload="handleBeforeUpload" :data="uploadExtraData"
              :on-success="handleUploadSuccess" :on-change="handleUploadChange">
            <el-button type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-col>
      </el-row>
      <el-row class="operate-row">
        <el-col :span="4" class="all-selected-block">
          <el-checkbox v-model="checked">全选</el-checkbox>
        </el-col>
        <el-col :span="20" class="other-block">
          <el-button>移动分组</el-button>
          <el-button>删除</el-button>
        </el-col>
      </el-row>
      <el-row class="content-area">
        <el-row class="content-empty-row" v-if="JSON.stringify(picList) == '[]'">哎呀，好像没有可以显示的图片哦~</el-row>
        <el-row class="content-row" type="flex" justify="start" v-else v-for="(row, index) in picList" key>
          <el-col :span="5" :offset="1" class="content-item" v-for="(item, idx) in row" key>
            <img :src="item.pic_url">
            <p class="item-title">{{item.pic_name}}</p>
            <p class="item-checked">
              <el-checkbox v-model="checked">&nbsp;{{item.pic_origin_name}}</el-checkbox>
            </p>
            <p class="item-operate">
              <el-tooltip placement="bottom" effect="light" popper-class="pic-edit-container" :manual="true" v-model="picArr[item.id].isVisible__editPicDialog">
                <!-- <li @click="showAddPicGroupDialog"><i class="el-icon-plus"></i>新建分组</li> -->
                <el-tooltip class="item" effect="dark" content="编辑名称" placement="top-start"><i class="el-icon-edit" @click="showEditPicDialog(item.id)"></i></el-tooltip>
                <el-row class="content" slot="content">
                  <div class="title">编辑名称</div>
                  <div class="input-name">
                    <el-input placeholder="请输入图片名称" v-model="picName__edit"></el-input>
                  </div>
                  <div class="operate-btn">
                    <el-button type="primary" @click="confirmEditPic(item.id)">确认</el-button>
                    <el-button type="primary" @click="hiddenEditPicDialog(item.id)">取消</el-button>
                  </div>
                </el-row>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="编辑名称" placement="top-start"><i class="el-icon-edit"></i></el-tooltip> -->
              <el-tooltip class="item" effect="dark" content="移动分组" placement="top"><i class="el-icon-picture"></i></el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top-end"><i class="el-icon-delete"></i></el-tooltip> -->
              <el-tooltip placement="bottom" effect="light" popper-class="pic-delete-container" :manual="true" v-model="picArr[item.id].isVisible__deletePicDialog">
                <!-- <li @click="showAddPicGroupDialog"><i class="el-icon-plus"></i>新建分组</li> -->
                <el-tooltip class="item" effect="dark" content="删除" placement="top-end"><i class="el-icon-delete" @click="showDeletePicDialog(item.id)"></i></el-tooltip>
                <el-row class="content" slot="content">
                  <div class="text">
                    您确定要删除这张图片吗？
                  </div>
                  <div class="operate-btn">
                    <el-button type="primary" @click="confirmDeletePic(item.id)">确认</el-button>
                    <el-button type="primary" @click="hiddenDeletePicDialog(item.id)">取消</el-button>
                  </div>
                </el-row>
              </el-tooltip>
            </p>
          </el-col>
        </el-row>
      </el-row>
    </el-col>
    <el-col :span="3" class="picture-group">
      <ul class="group-ul">
        <li :class="{'is-selected':item.id == currentSelectPicGroup.id}" v-for="(item, index) in picGroupList" :data-id="item.id"
            @click="selectPicGroup(item.id, item.group_name)">{{item.group_name}}
          <span class="picture-count">({{item.group_pic_count}})</span>
          <i class="el-icon-delete" @click="deletePicGroup(item.id)"></i>
        </li>
        <el-tooltip placement="bottom" effect="light" popper-class="group-add-container" :manual="true" v-model="isVisible__addPicGroupDialog">
          <li @click="showAddPicGroupDialog"><i class="el-icon-plus"></i>新建分组</li>
          <el-row class="content" slot="content">
            <div class="title">创建分组</div>
            <div class="input-name">
              <el-input placeholder="请输入分组名称" v-model="groupName"></el-input>
            </div>
            <div class="operate-btn">
              <el-button type="primary" @click="confirmAddPicGroup">确认</el-button>
              <el-button type="primary" @click="hiddenAddPicGroupDialog">取消</el-button>
            </div>
          </el-row>
        </el-tooltip>
      </ul>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  data() {
    return {
      picArr: [], // 图片对象数组，操作各个图片的数据驱动来源
      picList: '', // 图片列表
      picGroupList: [], //图片分组列表
      fileList: [],
      checked: false,
      isVisible__addPicGroupDialog: false, // 新增图片分组的弹框是否显示
      groupName: '', // 新增图片分组的名称
      willDeletePicGroupId: 3, // 将要删除的图片分组的id
      uploadExtraData: { // 上传图片时额外的参数对象
        user_id: 1,
        user_login: 'admin',
        pic_group_id: 1,
        pic_group_name: '全部图片'
      },
      loadingObj: {}, // el-loading实例对象
      picName__edit: '', //当前输入的图片编辑名称
      currentSelectPicGroup: {}, // 当前选择的分组（所在的分组）
    }
  },
  methods: {
    handlePreview(file, fileList) {
      console.log(file, fileList);
    },
    handleRemove(file) { // 当图片在handleBeforeUpload钩子中被阻止，会回调这个方法
      console.log('move');
    },
    handleBeforeUpload(file) {
      // 上传之前搜索媒体库中是否已经存在同名的图片，如果存在，那么将覆盖之前的图片
      // 或者先修改本地图片的名称再上传
      let $this = this
      this.loadingObj = $this.$loading({
        target: '.menu-main',
        text: '处理中...',
        customClass: 'loading-style'
      })
      //
      var promise = new Promise((resolve, reject) => {
        jQuery.ajax({
          type: 'GET',
          url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture',
          data: {
            exec_picture_exist: true,
            picture_origin_name: file.name
          },
          success(res) {
            console.log(res)
            resolve(res); // resolve()
          },
          error(error) {
            reject(error); // resolve()
            console.log(error);
          }
        })
      })

      return promise.then((res) => {
        $this.loadingObj.close()

        if (res.erron == 0) { // 表示媒体库已经存在该同名的图片，那么提示用户是否选择覆盖上传
          return $this.$confirm('媒体库已经存在同名的图片，选择继续上传将覆盖同名图片，是否继续?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $this.$set($this.uploadExtraData, 'exec_cover_upload', true) // 区别与正常的上传，这是同名覆盖上传操作
            $this.loadingObj = $this.$loading({
              target: '.menu-main',
              text: '努力上传中...',
              customClass: 'loading-style'
            })
          }).catch(() => {
            $this.$message({
              message: '图片上传已被取消~',
              type: 'warning'
            })
            reject() // 调用 promise对象的catch方法，让它可以阻止图片上传,其实就是抛出一个错误
          })
        } else {
          $this.loadingObj = $this.$loading({
            target: '.menu-main',
            text: '努力上传中...',
            customClass: 'loading-style'
          })
        }
      }).catch((err) => {
        reject() // 最后真正阻止中断图片上传的reject方法
      })
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response)
      this.uploadExtraData.exec_cover_upload = '' // 重置为正常的上传操作，非覆盖上传
      let $this = this
      if (response.erron == 0) { // 上传成功刷新图片列表到最新
        new Promise((resolve, reject) => {
          jQuery.ajax({
            type: 'GET',
            url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture',
            data: {
              exec_picture_row_order: true, // 表示图片为有序按规则的获取
              exec_picture_pagination: true, // 图片分页获取
              row_item: 4, // 表示图片一行显示4个
              page_item: 8, // 表示图片一页显示8个
              page_num: 1, // 表示图片第一页的列表数据
            },
            success(res) {
              if (res.erron == 0) {
                $this.picList = res.data // picList中的数据用于展示
                let picArr = Array()
                res.data.forEach(function(value, index) {
                  value.forEach(function(val, idx) {
                    picArr[val.id] = val
                  })
                })
                $this.picArr = picArr // picArr中的数据用于操作
                $this.picArr.forEach(function(val, idx) {
                  $this.$set(val, 'isVisible__editPicDialog', false) // 图片对象的名称编辑框是否显示
                  $this.$set(val, 'isVisible__movePicDialog', false) // 图片对象的移动分组框是否显示
                  $this.$set(val, 'isVisible__deletePicDialog', false) // 图片对象的删除框是否显示
                })
              } else {
                $this.picList = Array()
              }
              resolve()
            },
            error(error) {
              console.log(error);
            }
          })
        }).then(() => {
          $this.$message({
            message: '图片上传成功~',
            type: 'success'
          })
          $this.loadingObj.close()
        })
      }
    },
    handleUploadChange(file, fileList, data) {
      // console.log(123)
      // console.log(file.response)
      // console.log(fileList)
      // console.log(data)
    },
    // 点击选择一个图片分组
    selectPicGroup(id, groupName) {
      this.currentSelectPicGroup = {
        id: id,
        groupName: groupName
      }
      // 获取该分组的图片列表
      let $this = this
      new Promise((resolve, reject) => {
        $this.loadingObj = $this.$loading({
          target: '.menu-main',
          text: '努力加载中...',
          customClass: 'loading-style'
        })
        this.getPicList(resolve)
      }).then(() => {
        $this.loadingObj.close()
      })
    },
    // 删除图片分组
    deletePicGroup(id) {
      let $this = this
      let deleteId = id
      this.$confirm('此操作将永久删除该分组, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loadingObj = $this.$loading({
          target: '.menu-main',
          text: '努力加载中...',
          customClass: 'loading-style'
        })
        jQuery.ajax({
          type: 'DELETE',
          url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture_group/' + id,
          data: {},
          success(res) {
            if (res.erron == 0) {
              picGroupList = $this.picGroupList
              let newPicGroupList = picGroupList.filter(function(val, idx) {
                if (val.id == deleteId) { // 如果分组列表中的对象id等于要删除的id，那么将这个对象过滤掉
                  return false
                }
                return true
              })
              $this.picGroupList = newPicGroupList
              loadingObj.close()
              $this.$message({
                message: '删除分组成功啦~',
                type: 'success'
              })
            } else {
              $this.$message({
                message: '新建分组失败，请稍后再试~',
                type: 'error'
              })
            }
            $this.isVisible = false
            $this.groupName = ''
            console.log(res)
          },
          error(error) {
            console.log(error);
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
    showAddPicGroupDialog() {
      this.isVisible__addPicGroupDialog = true
    },
    hiddenAddPicGroupDialog() {
      this.isVisible__addPicGroupDialog = false
    },
    confirmAddPicGroup() {
      if (this.groupName) {
        let $this = this
        let loadingObj = $this.$loading({
          target: '.menu-main',
          text: '努力加载中...',
          customClass: 'loading-style'
        })
        jQuery.ajax({
          type: 'POST',
          url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture_group/',
          data: {
            create_obj: {
              user_id: 1, // 先写死
              user_login: 'admin', // 先写死
              group_name: this.groupName
            }
          },
          success(res) {
            if (res.erron == 0) {
              $this.$message({
                message: '新建分组成功啦~',
                type: 'success'
              })
              $this.picGroupList.push(res.data)
              loadingObj.close()
            } else {
              $this.$message({
                message: '新建分组失败，请稍后再试~',
                type: 'error'
              })
            }
            $this.isVisible = false
            $this.groupName = ''
          },
          error(error) {
            this.$message({
              message: '网络异常！',
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          message: '新建分组名称不能为空哦~',
          type: 'warning'
        })
      }
    },
    // 显示图片名称编辑框
    showEditPicDialog(id) {
      this.picArr[id].isVisible__editPicDialog = true
    },
    // 隐藏图片名称编辑框
    hiddenEditPicDialog(id) {
      this.picArr[id].isVisible__editPicDialog = false
    },
    // 确认图片编辑名称
    confirmEditPic(id) {
      if (this.picName__edit == '') {
        this.$message({
          message: '图片名称不能为空~',
          type: 'warning'
        })
        return
      }
      let $this = this
      let $id = id
      this.picArr[$id].isVisible__editPicDialog = false
      this.loadingObj = $this.$loading({
        target: '.menu-main',
        text: '处理中...',
        customClass: 'loading-style'
      })
      jQuery.ajax({
        type: 'PUT',
        url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture/' + id,
        data: {
          update_obj: {
            pic_name: this.picName__edit
          }
        },
        success(res) {
          console.log(res)
          if (res.erron == 0) {
            $this.picArr[id].pic_name = $this.picName__edit
            $this.$message({
              message: '图片名称编辑成功~',
              type: 'success'
            })
          } else {
            $this.$message({
              message: '图片名称编辑失败~',
              type: 'error'
            })
          }
          $this.picName__edit = '' // 编辑成功后重置输入的编辑名称为空
          $this.loadingObj.close()
        },
        error(error) {
          console.log(error);
        }
      })
    },
    // 显示图片删除框
    showDeletePicDialog(id) {
      this.picArr[id].isVisible__deletePicDialog = true
    },
    // 隐藏图片删除框
    hiddenDeletePicDialog(id) {
      this.picArr[id].isVisible__deletePicDialog = false
    },
    // 确认图片删除
    confirmDeletePic(id) {
      let $this = this
      this.picArr[id].isVisible__deletePicDialog = false
      this.loadingObj = this.$loading({
        target: '.menu-main',
        text: '处理中...',
        customClass: 'loading-style'
      })
      jQuery.ajax({
        type: 'DELETE',
        url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture/' + id,
        data: {},
        success(res) {
          console.log(res)
          // return
          if (res.erron == 0) {
            new Promise((resolve, reject) => {
              jQuery.ajax({
                type: 'GET',
                url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture',
                data: {
                  exec_picture_row_order: true, // 表示图片为有序按规则的获取
                  exec_picture_pagination: true, // 图片分页获取
                  row_item: 4, // 表示图片一行显示4个
                  page_item: 8, // 表示图片一页显示8个
                  page_num: 1, // 表示图片第一页的列表数据
                },
                success(res) {
                  if (res.erron == 0) {
                    $this.picList = res.data // picList中的数据用于展示
                    let picArr = Array()
                    res.data.forEach(function(value, index) {
                      value.forEach(function(val, idx) {
                        picArr[val.id] = val
                      })
                    })
                    $this.picArr = picArr // picArr中的数据用于操作
                    $this.picArr.forEach(function(val, idx) {
                      $this.$set(val, 'isVisible__editPicDialog', false) // 图片对象的名称编辑框是否显示
                      $this.$set(val, 'isVisible__movePicDialog', false) // 图片对象的移动分组框是否显示
                      $this.$set(val, 'isVisible__deletePicDialog', false) // 图片对象的删除框是否显示
                    })
                  } else {
                    $this.picList = Array()
                  }
                  resolve()
                },
                error(error) {
                  console.log(error);
                }
              })
            }).then(() => {
              $this.$message({
                message: '图片删除成功~',
                type: 'success'
              })
              $this.loadingObj.close()
            })
          } else {
            $this.$message({
              message: '图片删除失败~',
              type: 'error'
            })
            $this.loadingObj.close()
          }
        },
        error(error) {
          console.log(error);
        }
      })
    },
    // 获取图片分组列表
    getPicGroupList(resolve) {
      let $this = this
      jQuery.ajax({
        type: 'GET',
        url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture_group',
        data: {},
        success(res) {
          if (res.erron == 0) {
            $this.picGroupList = res.data
            $this.currentSelectPicGroup = { // 列表的第一个分组项默认作为第一次加载的选中项
              id: res.data[0].id,
              groupName: res.data[0].group_name
            }
            // console.log(res)
            resolve()
          }
        },
        error(error) {
          console.log(error);
        }
      })
    },
    // 获取图片列表
    getPicList(resolve) {
      let $this = this
      jQuery.ajax({
        type: 'GET',
        url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/picture',
        data: {
          exec_picture_row_order: true, // 表示图片为有序按规则的获取
          exec_picture_pagination: true, // 图片分页获取
          row_item: 4, // 表示图片一行显示4个
          page_item: 8, // 表示图片一页显示8个
          page_num: 1, // 表示图片第一页的列表数据
          pic_group_id: this.currentSelectPicGroup.id, // 当前选择的图片分组id
        },
        success(res) {
          console.log(res)
          if (res.erron == 0) {
            $this.picList = res.data // picList中的数据用于展示
            let picArr = Array()
            res.data.forEach(function(value, index) {
              value.forEach(function(val, idx) {
                picArr[val.id] = val
              })
            })
            $this.picArr = picArr // picArr中的数据用于操作
            $this.picArr.forEach(function(val, idx) {
              $this.$set(val, 'isVisible__editPicDialog', false) // 图片对象的名称编辑框是否显示
              $this.$set(val, 'isVisible__movePicDialog', false) // 图片对象的移动分组框是否显示
              $this.$set(val, 'isVisible__deletePicDialog', false) // 图片对象的删除框是否显示
            })
          } else {
            $this.picList = Array() // picList中的数据用于展示
          }
          resolve()
        },
        error(error) {
          console.log(error);
        }
      })
    }
  },
  created() {
    this.loadingObj = this.$loading({
      target: '.menu-main',
      text: '努力加载中...',
      customClass: 'loading-style'
    })
    new Promise((resolve, reject) => {
      this.getPicGroupList(resolve)
    }).then((val) => {
      new Promise((resolve, reject) => {
        this.getPicList(resolve)
      }).then(() => {
        this.loadingObj.close()
      })
    }).catch((error) => {
      console.log(error)
    })
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>@import "../../assets/css/media.css";
@import "../../assets/css/public.css";
.media-wrapper {
    height: 100%;
    .picture-main {
        background: #f5f5f5;
        .title-row {
            display: flex;
            align-items: center;
            padding: 5px 10px;
            background: #fff;
            .title-block {
                font-weight: bold;
            }
            .upload-block {
                text-align: right;
                .upload {
                    display: inline-block;
                }
            }
        }
        .operate-row {
            display: flex;
            align-items: center;
            padding: 5px 10px;
            background: #f4f5f9;
            border-bottom: 1px solid #e7e7eb;
        }
        .content-empty-row {
            background: #fff;
            text-align: center;
            padding-top: 100px;
            font-size: 24px;
            color: #999;
        }
        .content-row {
            padding: 10px 0;
            background: #fff;
            .content-item {
                text-align: center;
                border: 1px solid #ccc;
                img {
                    min-width: 150px;
                    max-width: 100%;
                    height: 220px;
                    display: block;
                    margin: 0 auto;
                }
                p {
                    margin: 0;
                }
                p.item-title {
                    // width: 180px;
                    margin: 0 auto;
                    padding: 0 20px;
                    line-height: 25px;
                    font-weight: bold;
                    border-top: 1px solid #ccc;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                p.item-checked {
                    line-height: 25px;
                    padding: 0 20px;
                    // color: #aaa;
                    label {
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        // padding: 0 20px;
                    }
                }
                p.item-operate {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    height: 30px;
                    border-top: 1px solid #ccc;
                    background: #f4f5f9;
                    i {
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        padding: 0 10px;
                        cursor: pointer;
                        &:hover {
                            background: #ddd;
                            color: #20a0ff;
                        }
                    }
                }
            }
            /*调整布局*/
            .content-item:first-child {
                margin-left: 2.0833%;
            }
        }
    }
    .picture-group {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        border-left: 1px solid #ccc;
        background: #fff;
        .group-ul {
            li {
                height: 36px;
                line-height: 36px;
                padding-left: 10px;
                cursor: pointer;
                &:hover {
                    background: #f4f5f9;
                    &:not(:first-child) > i.el-icon-delete {
                        position: absolute;
                        right: 5px;
                        line-height: 36px;
                        display: inline-block;
                    }
                    & > i.el-icon-delete:hover {
                        color: #20a0ff;
                    }
                }
                & > span.picture-count {
                    color: #aaa;
                    font-size: 12px;
                }
                & > i.el-icon-delete {
                    font-size: 16px;
                    color: #666;
                    display: none;
                }
            }
            li.is-selected {
                background: #eef1f6;
            }
        }
    }

}
</style>
