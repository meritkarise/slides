(function(){"use strict";const renderer=new marked.Renderer;renderer.image=((href,title,text)=>{return`\n        <div class="image">\n            <img src="${href}"/>\n        </div>\n    `});var Markdown={props:["source"],computed:{target(){return marked(this.source,{renderer:renderer,breaks:true,highlight:code=>hljs.highlightAuto(code).value})}},template:`\n        <div v-html="target"></div>\n    `};const style={slide:{position:"fixed",top:0,right:0,bottom:0,left:0,display:"flex"},col:{flex:1,overflow:"hidden"}};var Slide={components:{Markdown:Markdown},template:`\n        <div :style="slideStyle()">\n            <div v-for="(col, i) in slide" :style="colStyle(i)">\n                <markdown :source="col"></markdown>\n            </div>\n        </div>\n    `,props:["slide","values"],methods:{slideStyle(){return[style.slide,{background:`hsl(201, 90%, ${this.values.Brightness/2}%)`,fontSize:.8+this.values.Size*.005+"rem",padding:3+this.values.Padding*.05+"vw"}]},colStyle(i){return[style.col,{marginRight:i<this.slide.length-1&&"1.5rem"}]}}};var settings={values:{Size:25,Brightness:52,Padding:30},update(values){this.values=values}};var Settings={template:`\n        <div\n            v-show="show"\n            :style="style.wrapper"\n        >\n            <h4 style="margin: 0 0 1rem 0; color: rgba(255,255,255,0.75);">Settings</h4>\n            <div\n                v-for="(value, key) in values"\n                :style="style.value"\n            >   \n                {{ key }}: {{ values[key] }}\n                <input\n                    :style="style.range"\n                    v-model="values[key]"\n                    step="0.1"\n                    type="range"\n                />\n            </div>\n        </div>\n    `,data:()=>({show:false,values:settings.values,style:style$1}),watch:{values(values){settings.update(values)}},mounted(){document.addEventListener("keydown",e=>{if(e.keyCode==83){this.show=!this.show}})}};const style$1={wrapper:{zIndex:10,position:"fixed",top:0,right:0,bottom:0,width:"10rem",background:"rgba(0,0,0,0.7)",padding:"1.5rem",color:"rgba(255,255,255,1)"},value:{marginBottom:"1.5rem",fontFamily:"sans-serif",fontSize:"0.8rem",opacity:.7},range:{width:"95%"}};var Pager={template:`\n        <div :style="{\n            position: 'fixed',\n            top: 0,\n            bottom: 0,\n            width: '3.5rem',\n            cursor: 'pointer'\n        }"></div>\n    `};new Vue({el:"#app",components:{Slide:Slide,Settings:Settings,Pager:Pager},template:`\n        <div>\n            <settings></settings>\n            <slide\n                v-for="(slide, index) in slides"\n                :key="index"\n                v-show="currentSlide === index"\n                :values="settings.values"\n                :slide="slide"\n            >\n            </slide>\n            <pager @click.native="prev" style="left: 0" />\n            <pager @click.native="next" style="right: 0" />\n        </div>\n    `,data:{slides:[],currentSlide:0,settings:settings},methods:{parseSlides(slides){return slides.split("\n---\n").map(slide=>slide.split("\n--\n"))},prev(){this.currentSlide>0&&this.currentSlide--},next(){this.currentSlide<this.slides.length-1&&this.currentSlide++}},mounted(){this.currentSlide=parseInt(localStorage.getItem("currentSlide"))||0;axios.get("./README.md").then(res=>{this.slides=this.parseSlides(res.data)});document.addEventListener("keydown",e=>{if(e.keyCode==37){this.prev()}if(e.keyCode==39){this.next()}});hljs.initHighlightingOnLoad()},watch:{currentSlide(value){localStorage.setItem("currentSlide",value)}}})})();
