<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <!-- sticky吸顶的效果 -->
    <!-- v-loading加载中 -->
    <Stick :class-name="'sub-navbar'">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button
        v-loading="loading"
        type="success"
        style="margin-left: 10px"
        @click="submitForm"
      >
        {{ isEdit ? '编辑电子书' : '新增电子书' }}
      </el-button>
    </Stick>
    <div class="detail-container">
      <el-row>
        <!-- el-col会将屏幕分成24等份 -->
        <Warning />
        <el-col :span="24">
          <!-- 表单控件的具体样式 -->
          <EbookUpload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MDInput v-model="postForm.title" :maxlength="100" name="name" required>
              书名
            </MDInput>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="author" label="作者: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.author"
                  placeholder="作者"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="publisher" label="出版社: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.publisher"
                  placeholder="出版社"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="language" label="语言: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.language"
                  placeholder="语言"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rootFile" label="根文件: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="filePath" label="文件路径: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="unzipPath" label="解压路径: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="coverPath" label="封面路径: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="originalName" label="文件名称: " :label-width="labelWidth">
                <el-input
                  v-model="postForm.originalName"
                  placeholder="文件名称"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="cover" label="封面: " :label-width="labelWidth">
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img">
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label-width="labelWidth" label="目录: ">
                <div v-if="postForm.contents && postForm.contents.length > 0" class="contents-wrapper">
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Stick from '../../../components/Sticky'
import Warning from './Warning'
import EbookUpload from '@/components/EbookUpload'
import MDInput from '../../../components/MDinput'
import { createBook } from '../../../api/book'

// const defaultForm = {
//   title: '',
//   author: '',
//   publisher: '',
//   language: '',
//   rootFile: '',
//   cover: '',
//   url: '',
//   originalName: '',
//   fileName: '',
//   coverPath: '',
//   filePath: '',
//   unzipPath: ''
// }

const fields = {
  title: '标题',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}

const validateRequire = (rule, value, callback) => { // callback必须执行
  if (value?.length === 0) {
    callback(new Error(fields[rule.field] + '必须填写'))
  } else {
    callback()
  }
}

export default {
  components: {
    Stick,
    Warning,
    EbookUpload,
    MDInput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      loading: false,
      postForm: {
        // status: 'draft'
      },
      fileList: [],
      labelWidth: '120px',
      contentsTree: null,
      rules: { // key值对应着 el-form-item中的prop
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }]
      }
    }
  },
  methods: {
    onContentClick(data) {
      if (data.text) {
        window.open(data.text)
      }
    },
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm)
      this.contentsTree = []
      this.fileList = []
      this.$refs.postForm.resetFields() // 清空表单项
    },
    setDate(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath,
        contentsTree
      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath
      }
      this.contentsTree = contentsTree
    },
    onUploadSuccess(data) {
      console.log('onUploadSuccess', data)
      this.setDate(data)
    },
    onUploadRemove() {
      this.setDefault()
      console.log('onUploadRemove')
    },
    submitForm() { // 提交事件
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => { // 进行表单验证
          if (valid) {
            const book = Object.assign({}, this.postForm)
            delete book.contentsTree
            // console.log(book);
            if (!this.isEdit) { // 判断是新增还是更改
              createBook(book).then(response => {
                const { msg } = response
                this.$notify({ // 这里也是一个提示操作
                  title: '操作成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.setDefault()
              }).catch(() => {
                this.loading = false
                this.setDefault()
              })
            } else {
              // updateBook(book)
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
          }
        })
      }
    },
    showGuide() {
      console.log('showGuide')
    }
  }

}
</script>

<style lang="scss" scoped>
.detail-container{
  padding: 40px 50px 20px;
}
.preview-img{
  width: 200px;
  height: 270px;
}

.contents-wrapper{

}
</style>
