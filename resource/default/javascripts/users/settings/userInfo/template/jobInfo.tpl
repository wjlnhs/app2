{{each List}}
<div class="cate-body jobitem" style="display:block" cid="{{$value.ID}}">
    <div class="gray-yellow l-h50">
        <span class="m-r50 m-l20 cate-title">{{$dateFormat($value.StartTime,'yyyy-MM')}} － {{$dateFormat($value.EndTime,'yyyy-MM')}}</span>
        <span class="m-r50 m-l20 cate-title">{{$value.MainName}}</span>
        <a class="btn-fold rt"></a>
        <a class="btn-delete edit-icon rt">删除</a>
        <a class="btn-edit-one rt">编辑</a>
    </div>
    <div class="cate-item">
        <div class="preview m-l40" style="display: block;">
            <div class="app-table-list2 bw m-t10">
                <table>
                    <tbody>
                    <tr>
                        <td class="black w-85">公司</td>
                        <td>{{$value.MainName}}</td>
                    </tr>
                    <tr>
                        <td class="black">地区</td>
                        <td class="citytxt">{{if $value.CityTxt}}{{$value.CityTxt}}{{/if}}</td>
                    </tr>
                    <tr>
                        <td class="black">时间</td>
                        <td>{{if $value.StartTime}}{{$simpleDateFormat($value.StartTime)}}{{/if}}- {{if $value.StartTime}}{{$simpleDateFormat($value.EndTime)}}{{/if}}</td>
                    </tr>
                    <tr>
                        <td class="black">职位</td>
                        <td>{{$value.Position}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="app-table-list2 b-blue-sty1 bw m-t10 m-l40" style="display:none;">
            <table>
                <tbody>
                <tr>
                    <td class="black w-85">公司</td>
                    <td><input class="company" placeholder="公司名称" value="{{$value.MainName}}" defaultVal="{{$value.MainName}}" type="text" value=""></td>
                </tr>
                <tr>
                    <td class="black">地区</td>
                    <td><div class="city-group" lev2code="{{$value.Location}}" defaultlev2code="{{$value.Location}}">
                        <input class="citylev1" value="{{$value.City}}" defaultVal="{{$value.City}}" placeholder="-请选择-" type="text">
                        <input class="rt citylev2" value="{{$value.Province}}" defaultVal="{{$value.Province}}" placeholder="-请选择-" type="text">
                    </div>
                    </td>
                </tr>
                <tr>
                    <td class="black">时间</td>
                    <td class="job-time">
                        <input class="startTime" class="job-time-start" id="edit_StartTime_{{$creatguid($value.ID)}}" value="{{$simpleDateFormat($value.StartTime)}}" onfocus="WdatePicker({maxDate:'#F{$dp.$D(\'edit_EndTime_{{$creatguid($value.ID)}}\')}'})" type="text" placeholder="2014-12-12">
                        <input class="endTime" class="job-time-end" id="edit_EndTime_{{$creatguid($value.ID)}}" value="{{$simpleDateFormat($value.EndTime)}}"  onfocus="WdatePicker({minDate:'#F{$dp.$D(\'edit_StartTime_{{$creatguid($value.ID)}}\')}'})" type="text" placeholder="2014-12-12">
                    </td>
                </tr>
                <tr>
                    <td class="black">职位</td>
                    <td><input class="position" type="text" value="{{$value.Position}}" defaultVal="{{$value.Position}}" placeholder="职位" value=""></td>
                </tr>
                </tbody>
            </table>
            <div class="sub tcenter m-t15 ">
                <span class="btn-blue-empty-h32 cancel">&nbsp;取 消&nbsp;</span>
                <span class="btn-blue-h32 confirm m-l20">&nbsp;确 定&nbsp;</span>
            </div>
        </div>
    </div>
</div>
{{/each}}