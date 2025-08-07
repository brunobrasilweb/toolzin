import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica se a requisição está vindo do domínio toolzin.site
  const hostname = request.headers.get('host');
  
  if (hostname?.includes('toolzin.site')) {
    // Constrói a nova URL com o domínio toolizio.com mantendo o path
    const url = new URL(request.url);
    const newUrl = `https://toolizio.com${url.pathname}${url.search}${url.hash}`;
    
    // Retorna um redirecionamento permanente (301)
    return NextResponse.redirect(newUrl, 301);
  }
  
  return NextResponse.next();
}

// Configura o middleware para rodar em todas as rotas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
