<div class="communityPlugin">
    <ul class="tab-nav heit">
        {if header.kankan}
        <li class="s-icon kk-btn">侃侃</li>
        {/if}
        {if header.schedule}
        <li class="s-icon schedule-btn">日程</li>
        {/if}
        {if header.daily}
        <li class="s-icon weekofdaily-btn">周日报</li>
        {/if}
    </ul>
    <div class="tab-content">
        {=tabcontent}
    </div>
</div>