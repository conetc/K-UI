export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // 核心逻辑：精准拦截所有访问 .pages.dev 后缀的流量
  if (url.hostname.endsWith('.pages.dev')) {
    
    // 【模式A】301 永久重定向 (推荐)：
    // 强制将主机名替换为您的高级自定义域名
    url.hostname = 'kui.panle.dpdns.org';
    return Response.redirect(url.toString(), 301);
    
    // --------------------------------------------------
    // 【模式B】403 暴力阻断 (如果您连重定向都不想给，想直接掐断)：
    // 请删除或注释掉上面的【模式A】两行代码，并取消下方这行的注释即可
    // return new Response('Forbidden: Access Denied', { status: 403 });
  }
  
  // 对于正常通过 kui.panle.dpdns.org 访问的合法流量，直接放行进入主程序
  return context.next();
}
