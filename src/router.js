import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
import jwtDecode from "jwt-decode";

const MainLayout = () => import("./views/layout/MainLayout.vue");
const DefaultLayout = () => import("./views/layout/DefaultLayout.vue");
const Login = () => import("./views/pages/Login.vue");
// const Dashboard = () => import("./views/pages/Dashboard.vue");
const PortalPermissoes = () => import("./views/pages/portal/Permissoes.vue");
const ApiChaveAcesso = () => import("./views/pages/api/ChaveAcesso.vue");
const EmailsAutenticados = () => import("./views/pages/portal/EmailsAutenticados.vue");
const ProdutoCustomizado = () => import("./views/pages/portal/ProdutoCustomizado.vue");
const CxClientes = () => import("./views/pages/cx/Clientes.vue");
const WebmotorsSolicitacaoCompraNumero = () =>
  import("./views/pages/webmotors/SolicitacaoCompraNumero.vue");
const WebmotorsSolicitacaoCancelamentoNumero = () =>
  import("./views/pages/webmotors/SolicitacaoCancelamentoNumero.vue");
const Autorizacao = () => import("./views/pages/portal/Autorizacao.vue");
const CadastroDeNumeros = () => import("./views/pages/portal/CadastroDeNumeros.vue");
const CadastroDeEmpresa = () => import("./views/pages/portal/CadastroDeEmpresa.vue");
const ReprocessamentoComportamento = () =>
  import("./views/pages/portal/ReprocessamentoComportamento.vue");
const Relatorios = () => import("./views/pages/portal/Relatorios.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    component: MainLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "portal",
        component: DefaultLayout,
        children: [
          {
            path: "permissoes",
            component: PortalPermissoes,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "emails-autenticados",
            component: EmailsAutenticados,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "produto-customizado",
            component: ProdutoCustomizado,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "cadastro-de-numeros",
            component: CadastroDeNumeros,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "cadastro-de-empresa",
            component: CadastroDeEmpresa,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "reprocessamento-comportamento",
            component: ReprocessamentoComportamento,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "relatorios",
            component: Relatorios,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "autorizacao",
            component: Autorizacao,
            meta: {
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: "api",
        component: DefaultLayout,
        children: [
          {
            path: "chave-acesso",
            component: ApiChaveAcesso,
            meta: {
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: "cx",
        component: DefaultLayout,
        children: [
          {
            path: "clientes",
            component: CxClientes,
            meta: {
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: "webmotors",
        component: DefaultLayout,
        children: [
          {
            path: "solicitacao-compra-numero",
            component: WebmotorsSolicitacaoCompraNumero,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: "solicitacao-cancelamento-numero",
            component: WebmotorsSolicitacaoCancelamentoNumero,
            meta: {
              requiresAuth: true
            }
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  let valid = !to.matched.some(record => record.meta.requiresAuth);
  if (!valid) {
    if (store.state.auth.token) {
      const currentTime = Date.now() / 1000;
      const jwt = jwtDecode(store.state.auth.token);
      valid = jwt.exp > currentTime;
    }
  }

  if (!valid) {
    next({
      path: "/login",
      params: { nextUrl: to.fullPath }
    });
  } else next();
});

export default router;
