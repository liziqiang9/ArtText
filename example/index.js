import ArtText from '../lib'
import "./markdown.css"
let md = "\
1234567890 0807\n\
[百度百科](https://baike.baidu.com/item/markdown/3245829?fr=aladdin)\n\
## markdown 编辑\n\
Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。\n\
Markdown具有一系列衍生版本，用于扩展Markdown的功能（如表格、脚注、内嵌HTML等等），这些功能原初的Markdown尚不具备，它们能让Markdown转换成更多的格式，例如LaTeX，Docbook。Markdown增强版中比较有名的有Markdown Extra、MultiMarkdown、 Maruku等。这些衍生版本要么基于工具，如Pandoc；要么基于网站，如GitHub和Wikipedia，在语法上基本兼容，但在一些语法和渲染效果上有改动。\n\
## markdown \n\
Markdown is a markup language that can be written with a common text editor . Through simple markup syntax, it can make common text content have a certain format.\n\
Markdown has a series of derivative versions to extend the functions of Markdown (such as tables, footnotes, embedded HTML, etc.). These functions are not available in the original Markdown. They can convert Markdown into more formats, such as LaTeX, Docbook . The more famous Markdown enhanced versions include Markdown Extra, MultiMarkdown, Maruku, etc. These derivative versions are either based on tools, such as Pandoc; or based on websites, such as GitHub and Wikipedia, which are basically compatible in syntax, but have some changes in syntax and rendering effects.\n\
### 标题\n\
标题能显示出文章的结构。行首插入1-6个#，每增加一个#表示更深入层次的内容，对应到标题的深度由1-6阶。\n\
# H1 :# Header 1\n\
## H2 :## Header 2\n\
### H3 :### Header 3\n\
#### H4 :#### Header 4\n\
##### H5 :##### Header 5\n\
###### H6 :###### Header 6\n\
#### 代码块\n\
`print(\"123\")`\n\
#### 图片\n\
![ad](https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg)\n\
## mark\n\
链接 :[Title](URL)\n\
加粗 : **Bold**\n\
斜体字 :*Italics*\n\
高亮 :==text==\n\
删除线 :~~text~~\n\
下划线 :__text__\n\
上标 :文本^text^\n\
下标 :文本~text~\n\
* [x] 已完成\n\
* [ ] 未完成\n\
段落 : 段落之间空一行\n\
列表 :* 添加星号成为一个新的列表项。\n\
引用 :> 引用内容\n\
> 引用\n\
> 引用\n\
1. 有序列表\n\
2. 有序列表\n\
* 无序列表\n\
* 无序列表\n\
    * 给岁月以文明，而不是给文明以岁月。\n\
内嵌代码 : `alert('Hello World');`\n\
| ads    |dadsad  |dadasd|\n\
| ---    |---  |---|\n\
| asdasd | dsadsad ||\n\
| asdasd | dsadsad |ads|\n\
画水平线 (HR) :***\n\
***\n\
math：$x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$\n\
|[th]ads    |[th]dadsad  |[th]dadasd|\n\
| asdasd | dsadsad ||\n\
| asdasd | dsadsad |ads|\n\
\n\
``` flow\n\
st=>start: 用户登陆\n\
op=>operation: 登陆操作\n\
cond=>condition: 登陆成功 Yes or No?\n\
e=>end: 进入后台\n\
st->op->cond\n\
cond(yes)->e\n\
cond(no)->op\n\
```\n\
``` python\n\
import sys\n\
def aa(x):\n\
    return x\n\
class bb:\n\
    def __init__(self, x, y):\n\
        self.x = x\n\
        self.y = y\n\
        dir(self)\n\
```\n\
``` html\n\
    <!DOCTYPE html>\n\
    <!-- KaTeX requires the use of the HTML5 doctype. Without it, KaTeX may not render properly -->\n\
    <html>\n\
      <head>\n\
        <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css\" integrity=\"sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X\" crossorigin=\"anonymous\">\n\
        \n\
        <!-- The loading of KaTeX is deferred to speed up page rendering -->\n\
        <script defer src=\"https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js\" integrity=\"sha384-g7c+Jr9ZivxKLnZTDUhnkOnsh30B4H0rpLUpJ4jAIKs4fnJI+sEnkvrMWph2EDg4\" crossorigin=\"anonymous\"></script>\n\
        \n\
        <!-- To automatically render math in text elements, include the auto-render extension: -->\n\
        <script defer src=\"https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/auto-render.min.js\" integrity=\"sha384-mll67QQFJfxn0IYznZYonOWZ644AWYC+Pt2cHqMaRhXVrursRwvLnLaebdGIlYNa\" crossorigin=\"anonymous\"\n\
            onload=\"renderMathInElement(document.body);\"></script>\n\
      </head>\n\
      ...\n\
    </html>\n\
```\n\
\n"
function uploadImg(img){
    return 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1583317410,1374114198&fm=74&app=80&f=PNG?w=200&h=200';
}
ArtText.use(uploadImg)
const container = document.querySelector('#art');
const art = new ArtText(container, {'md': md});

art.init();