const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const replace = require('gulp-replace');
const {dest} = require('gulp');
const fs = require('fs');
const path = require('path');

// 将less文件编译为css 并压缩css文件到发布目录
gulp.task('css', () => gulp
  .src(['src/packages/**/*.less'])
  .pipe($.less())
  .pipe($.rename((path) => {
    path.extname = '.css';
  }))
  .pipe(gulp.dest((file) => file.base)));


// 开启本地服务 监听文件的变化
gulp.task('watch', () => {
  gulp.watch('src/packages/**/*.less', gulp.series('css'));
});

/**
 * 初始化output文件夹
 * Gulp task要
 *  返回Stream、Promise
 *  call the callback function
 *  返回child_process
 *  返回RxJS Observable
 *  返回EventEmitter
 * 才算完成
 */
gulp.task('initOutput', () => {
  return new Promise((resolve, reject) => {
    fs.access('output', error => {
      if (!error) {
        // output 存在则清空内容
        fs.readdir('output', (err, files) => {
          if (files.length !== 0) {
            for (const file of files) {
              fs.unlink(path.join('output', file), (err) => {
                if (err) {
                  reject(err);
                }
              });
            }
          }
        })
      } else {
        // output不存在则新建
        fs.mkdirSync('output');
      }
    });
    resolve();
  });
});

/**
 * 转换字符串
 * 将src/packages/str.txt文件中的‘换行’改为‘,’
 * 输出结果到output/str.txt
 */
gulp.task('str', () => gulp
  .src(['src/packages/str.txt'])
  .pipe(replace('\n', ','))
  .pipe(dest('output/str.txt'))
)
