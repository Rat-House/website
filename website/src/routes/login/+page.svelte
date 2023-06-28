<script>
  import PocketBase from 'pocketbase';
  import { browser } from '$app/environment';
  import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';

  const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL);

  function discord() {
    if (!browser) return;
    console.log('logging in with discord');
    // This method initializes a one-off realtime subscription and will
    // open a popup window with the OAuth2 vendor page to authenticate.
    //
    // Once the external OAuth2 sign-in/sign-up flow is completed, the popup
    // window will be automatically closed and the OAuth2 data sent back
    // to the user through the previously established realtime connection.
    pb.collection('users')
      .authWithOAuth2({
        provider: 'discord',
        scopes: ['identify', 'email'],
        redirectUrl: 'http://localhost/api/oauth2-redirect'
      })
      .then(() => {
        // after the above you can also access the auth data from the authStore
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore.model.id);
      });

    // "logout" the last authenticated model
    // pb.authStore.clear();
  }
</script>

<button on:click={discord}>discord</button>
