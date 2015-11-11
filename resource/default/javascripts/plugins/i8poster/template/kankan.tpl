<div class="kk-tab">
            <div class="kk-body">
                <div class="kk-content rel">
                    <textarea class="kk-content-text" id="kk-content-{kkConfig.kid}" placeholder="{kkConfig.kkplaceholder}"></textarea>
                    <i class="icon headofarrow" ></i>
                </div>
                <div class="kk-footer">
                    <ul class="functions-btns-left">
                        {if kkConfig.attachment}
                            <li class="s-icon attachment-btn">附件</li>
                        {/if}
                        {if kkConfig.face}
                            <li class="s-icon expression-btn active">表情 </li>
                        {/if}
                        {if kkConfig.topic}
                            <li class="s-icon topic-btn">话题</li>
                        {/if}
                    </ul>
                    <a class="btn-blue-h32 kk-sub">发布</a>
                    {if kkConfig.scope}
                    <div class="release-scope" scope-value="scope-null">
                        <div class="release-scope-title s-icon"><span class="scope-txt-title">请选择发布范围</span><i class="icon"></i></div>
                        <ul class="release-scope-group">
                            <li class="s-icon enterprise-community-btn">企业社区</li>
                            <li class="s-icon only-visible-btn">仅@可见</li>
                            <li class="icon new-group-btn">创建新群组</li>
                        </ul>
                    </div>
                    {/if}
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
            </div>
            <div class="attachment-tip abs">
                最多5个文件，单个文件不超过30M 支持格式：图片、都doc、xls、ppt、txt、rar、pdf
                <i class="icon headofarrow"></i>
            </div>
            <div class="kk-functions">
                <div class="kk-attach-box" style="display: none">
                    <ul>
                        <li class="pic"><span></span><b>产品技术委员会.png</b><i class="delete-attach"></i></li>
                        <li class="pdf"><span></span><b>产品技术委员会.pdf</b><i class="delete-attach"></i></li>
                        <li class="ppt"><span></span><b>产品技术委员会.ppt</b><i class="delete-attach"></i></li>
                        <li class="rar"><span></span><b>产品技术委员会.rar</b><i class="delete-attach"></i></li>
                        <li class="txt"><span></span><b>产品技术委员会.txt</b><i class="delete-attach"></i></li>
                        <li class="doc"><span></span><b>产品技术委员会.doc</b><i class="delete-attach"></i></li>
                        <li class="xls"><span></span><b>产品技术委员会.xls</b><i class="delete-attach"></i></li>
                        <li class="custom"><span></span><b>产品技术委员会.pdf</b><i class="delete-attach"></i></li>
                    </ul>
                </div>
                <div class="expression-box" style="display: none">
                    <img src="/default/images/community/expression.png">
                </div>
                <div class="topic-box"></div>
            </div>

        </div>