<template>
<div class="media">
  <el-row class="media-wrapper">
    <el-col :span="21" class="picture-main">
      <el-row class="title-row">
        <el-col :span="6" class="title-block">全部图片</el-col>
        <el-col :span="18" class="upload-block">
          <span>提示：图片大小不超过3M</span>
          <el-upload class="upload" action="http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/media" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
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
    </el-col>
    <el-col :span="3" class="picture-group">
      <ul class="group-ul">
        <li v-for="(item, index) in pictureGroupList">{{item.group_name}}<span class="picture-count">&nbsp;({{item.group_picture_count}})</span></li>
        <li><i class="el-icon-plus"></i>新建分组</li>
      </ul>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  data() {
    return {
      pictureGroupList: [{
        group_name: '全部图片',
        group_picture_count: 333
      }, {
        group_name: '未分组',
        group_picture_count: 55
      }, {
        group_name: '居委会一',
        group_picture_count: 2
      }, {
        group_name: '居委会二',
        group_picture_count: 20
      }, {
        group_name: '居委会三',
        group_picture_count: 300
      }],
      fileList: [],
      checked: false
    }
  },
  methods: {
    handlePreview(file, fileList) {
      console.log(file, fileList);
    },
    handleRemove(file) {
      console.log(file);
    }
  }
}
</script>

<style lang="scss" scoped>
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
    }

    .picture-group {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        border-left: 1px solid #ccc;
        background: #fff;

        .group-ul > li {
            height: 36px;
            line-height: 36px;
            padding-left: 10px;
            cursor: pointer;
        }
        .group-ul > li > span.picture-count {
            color: #ccc;
        }
        .group-ul > li:hover {
            background: #f4f5f9;
        }
    }

}
</style>
