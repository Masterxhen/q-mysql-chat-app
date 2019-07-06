<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white" v-if="isLoggedIn">
        <div>
          <div style="width: 100%; min-width: 450px; max-height:500px; height:100%; padding: 5px 15px; overflow-y: scroll; overflow-x: hidden;">
            <q-chat-message v-for="msg in messages" :key="msg"
              :name="msg.username === username ? 'me' : msg.username"
              :text="[msg.message]"
              :sent="msg.username === username ? true : false"
            />
            <!-- <li v-for="(msg, index) in messages" :key="index">
              {{msg.username}}
              <q-avatar size="50px" font-size="30px" color="teal" text-color="white" icon="directions" />
              {{msg.message}}
            </li> -->
          </div>
          <div>
            <q-input class="bg-white" light outlined v-model="message" placeholder="Enter your Messaage" />
            <q-btn color="green" @click="sendMessage" icon="send" label="Send"/>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="bg-primary text-white" v-else>
        <div style="width: 400px; height:150px;">
          <q-input dark outlined placeholder="Enter Name" v-model="username" />
          <q-btn class="q-my-xl absolute-center" color="green" @click="reg" label="Enter" icon="send" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import io from 'socket.io-client'
export default {
  name: 'PageIndex',
  data: () => ({
    message: '',
    messages: [],
    username: '',
    isLoggedIn: false,
    socket: io('localhost:3001')
  }),
  methods: {
    sendMessage () {
      this.socket.emit('SEND_MESSAGE', {
        username: this.username,
        message: this.message
      })
      this.message = ''
    },
    reg () {
      if (this.username !== '') this.isLoggedIn = true
    }
  },
  mounted () {
    this.socket.on('MESSAGE', (data) => {
      this.messages = data
    })
  }
}
</script>
