var fs = require('fs');
var Q = require('q');
var path = require('path');

const XML_DIR = path.join(__dirname, './Privacy policy');
const I18N_IN_DIR = path.join(__dirname, './i18n');
const I18N_OUT_DIR = path.join(__dirname, './out');

Q.nfcall(fs.readdir, XML_DIR).then((files) => {
  files.forEach((filename) => {
    var xmlPath = path.join(XML_DIR, filename);
    var fileSuffix = filename.substr(filename.indexOf('string') + 7)
                         .replace(/^(\w*)([-])?(\w{2})?\.xml$/,
                            ($0, $1, $2, $3) => 'messages_' + $1.toLowerCase() + ($2 ? '_' : '') + ($3 || '') + '.properties');
    var propertiesInPath = path.join(I18N_IN_DIR, fileSuffix);
    var propertiesOutPath = path.join(I18N_OUT_DIR, fileSuffix);

    Q.nfcall(fs.readFile, xmlPath, 'utf-8').then((content) => {
      return content.replace('<?xml version="1.0" encoding="utf-8"?>', '')
        .replace('<resources xmlns:xliff="http://schemas.android.com/tools">', '')
        .replace('</resources>', '')
        .replace(/<!--[^-]+-->/g, '')
        .replace(/<string name="(privacy_policy|terms_and_conditions_of_use)">(.*)<\/string>/g, '<h2>$2</h2>')
        .replace(/<string name="(privacy_policy_content_one|privacy_policy_content_two|privacy_policy_content_five|terms_and_conditions_of_use_content_two|terms_and_conditions_of_use_content_three)">(.*)<\/string>/g, '$2')
        .replace(/<string name="(\w+)">\s*(.+)<\/string>/g, '<p>$2</p>')
        .replace(/<b>([^<]+)<\/b>/g, '<h3>$1</h3>')
        .replace(/\\n\\n/g, '\\n')
        .replace(/\\n/g, '</p><p>')
        .replace(/<p><h3>/g, '<h3>')
        .replace(/<\/h3><\/p>/g, '</h3>')
        .replace(/<li>([^<]+)<\/li>/g, '$1')
        .replace(/<p>$/gm, '')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>([^<]+)$/gm, '<p>$1</p>')
        //.replace(/^\s*<\/p>$/gm, '')
        .replace(/<xliff:g example="([^"]+)" id="date">%1\$s<\/xliff:g>/g, '$1')
        .replace(/\s*\n\s*/g, '');
    }).then((policy) => {
        if(fs.existsSync(propertiesInPath)) {
          return Q.nfcall(fs.readFile, propertiesInPath, 'utf-8').then((content) => {
            if(/text\.policy=/.test(content)) {
              content = content.replace(/text\.policy=(.*)$/m, 'text.policy=' + policy);
            } else {
              content += '\ntext.policy=' + policy;
            }
            return content;
          })
        } else {
          return Q.reject(fileSuffix + ' Not exist');
        }
    }).then((content) => {
      Q.nfcall(fs.writeFile, propertiesOutPath, content, 'utf-8')
    }).then((result) => {
      console.log('write ' + fileSuffix + ' [OK]');
    }).catch(console.log)
  })
});