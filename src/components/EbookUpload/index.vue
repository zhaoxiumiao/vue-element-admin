<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-upload"
    >
      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">
        请将电子书拖入或者 <em>点击上传</em>
      </div>
      <div v-else class="el-upload__text">图书已上传</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}book/upload`
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}` // 设置head头 token认证
      }
    }
  },
  methods: {
    beforeUpload(file) { // 上传之前调用
      console.log(file)
      this.$emit('beforeUpload', file)
    },
    onSuccess(response, file) { // 上传成功
      // console.log(response, file)
      const { code, msg, data } = response
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$emit('onSuccess', data)
      } else {
        this.$message({
          message: (msg && `上传失败, 失败原因: ${msg}`) || '上传失败',
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },
    onError(err) { // 异常处理
      console.log({ err })
      const errMsg = err.message && JSON.parse(err.message)
      this.$message({
        message: (errMsg && errMsg.msg && `上传失败, 失败原因: ${errMsg.msg}`) || '上传失败',
        type: 'error'
      })
      this.$emit('onError', err)
    },
    onRemove() { // 移除时
      this.$message({
        message: '电子书删除成功',
        type: 'success'
      })
      this.$emit('onRemove')
    },
    onExceed() {
      this.$message({
        message: '每次只能上传一次电子书',
        type: 'warning'
      })
    }
  }

}
</script>
