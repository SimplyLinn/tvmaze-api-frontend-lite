<template>
  <div id="app">
    <b-container>
      <b-navbar toggleable="md">
        <b-navbar-brand to="/"><img src="/static/img/logo_transparent.png" style="height: 100px;" alt="Linn's TV Search"/></b-navbar-brand>
        <b-navbar-toggle target="mainNav">
          <img src="/static/img/hamburger_icon.svg" />
        </b-navbar-toggle>
        <b-collapse is-nav id="mainNav">
          <b-navbar-nav>
            <b-nav-item to="about">About Us</b-nav-item>
            <b-nav-item href="https://github.com/SimplyLinn/tvmaze-api-frontend" class="nav-github-link"><img class="icon" src="/static/img/GitHub-Mark.png"> Github</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <router-view>
      </router-view>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>
