<!doctype html>
<html class="theme-next {% if theme.use_motion %}use-motion{% endif %} {% if theme.scheme %}theme-next-{{ theme.scheme | lower }}{% endif %}">
<head>
  {% include '_partials/head.swig' %}
  <title>{% block title %}{% endblock %}</title>
</head>

<body>
  {% include '_partials/old-browsers.swig' %}

  <div class="container one-column {% block page_class %}{% endblock %}">
    <div class="headband"></div>

    <div id="header" class="header">
      <div class="header-inner">
        {% include '_partials/header.swig' %}
      </div>
    </div>

    <div id="main" class="main">
      <div class="main-inner">
        <div id="content" class="content">
          {% block content %}{% endblock %}
        </div>

        {% if (theme.duoshuo_hotartical and page.title)  %}
          <!-- 多说热评文章-->
          <p>热评文章</p>
          <div class="ds-top-threads" data-range="weekly" data-num-items="4"></div>
        {% endif %}
      </div>


      {% block sidebar %}{% endblock %}
    </div>

    <div id="footer" class="footer">
      <div class="footer-inner">
        我被看了 <span id="busuanzi_value_site_pv"></span> 次~您是第<span id="busuanzi_value_site_uv"></span>个小伙伴<br>
        <script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1255866986'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s11.cnzz.com/z_stat.php%3Fid%3D1255866986%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));</script>
        {% include '_partials/footer.swig' %}
      </div>
    </div>

    <div class="back-to-top"></div>
  </div>
  <script async src="https://dn-lbstatics.qbox.me/busuanzi/2.3/busuanzi.pure.mini.js"></script>
  <script type="text/javascript" src="{{ url_for(theme.vendors) }}/jquery/index.js?v=2.1.3"></script>

  {# This block is used to set options before any other scripts run #}
  {% block script_extra_before %}{% endblock %}

  {% include '_scripts/fancy-box.swig' %}
  {% include '_scripts/helpers.swig' %}
  {% include '_scripts/motion.swig' %}
  <script type="text/javascript" src="{{ url_for(theme.js) }}/search-toggle.js"></script>

  {% block script_extra %}{% endblock %}

  <script type="text/javascript">
    $(document).ready(function () {
      if (CONFIG.sidebar === 'always') {
        displaySidebar();
      }
    });
  </script>

  {% include '_scripts/mathjax.swig' %}
  {% block comment_system %}{% endblock %}

  {% include '_scripts/baidushare.swig' %}
  {% include '_scripts/analytics/google-analytics.swig' %}
  
  <!-- lazyload -->
  <script type="text/javascript" src="{{ url_for(theme.js) }}/lazyload.js"></script>
      <script type="text/javascript">
        jQuery(function() {          
            jQuery("#posts img").lazyload({
              placeholder:"http://www.arao.me/loading.gif",  
                effect:"fadeIn"
              });
            });
    </script>   
</body>
</html>
