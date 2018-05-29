<view>

  <!-- 搜索 -->
  <view class='module_1'>
    <navigator url='searchResult/searchResult'>
      <input class='vSearch-inp' type='text' placeholder='请输入搜索内容' maxlength="15"></input>
      <icon class='vSearch-icon' type='search' size='16' color='#999'></icon>
    </navigator>
  </view>

  <!-- 轮播 -->
  <swiper class="module_2" autoplay="true" interval="{{interval}}" indicator-dots="true" circular="true" catchtap='onSwiperTap'>
    <block wx:for="{{module_2}}" wx:key="a">
      <swiper-item>
        <navigator url="{{item.link_value}}" hover-class="navigator-hover">
          <image class='vSlider-image' src="{{item.picture}}" />
        </navigator>
      </swiper-item>
    </block>
  </swiper>

  <!-- 首页导航 -->
  <view class='module_3'>
    <block wx:for="{{module_3}}" wx:key="b">
      <navigator url="{{item.link_value}}" hover-class="navigator-hover">
        <view class='quickNav'>
          <image class='img' src='{{item.picture}}'>
          </image>
          <view class='title'>{{item.text}}</view>
        </view>
      </navigator>
    </block>
  </view>

  
  <!-- 新闻列表 -->
  <block wx:for="{{articleListData}}" wx:key="c">
    <navigator url="/vNewsList-detail/vNewsList-detail?id={{item.article_id}}" hover-class="navigator-hover">
      <view class='newsList'>
        <view class='image'>
          <image class='img' mode='scaleToFill' src='{{item.picture}}'></image>
        </view>
        <view class='content'>
          <text class='txt1'>{{item.title}}</text>
          <text class='txt2'>{{item.keywords}}</text>
        </view>
      </view>
    </navigator>
  </block>

</view>
