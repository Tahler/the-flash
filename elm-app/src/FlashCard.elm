module FlashCard exposing (FlashCard)

-- MODEL


type alias Model =
    { text : String
    , translation : Maybe String
    , imageUrls : List String
    , audioUrl : String
    }


init : Session -> ( Model, Cmd Msg )
init session =
    ( { session = session
      , problems = []
      , status = Loading
      }
    , Cmd.batch
        [ Api.get Endpoint.user (Session.cred session) (Decode.field "user" formDecoder)
            |> Http.send CompletedFormLoad
        , Task.perform (\_ -> PassedSlowLoadThreshold) Loading.slowThreshold
        ]
    )



-- VIEW


view : Model -> { title : String, content : Html Msg }
view model =
    { title = "Settings"
    , content =
        case Session.cred model.session of
            Just cred ->
                div [ class "settings-page" ]
                    [ div [ class "container page" ]
                        [ div [ class "row" ]
                            [ div [ class "col-md-6 offset-md-3 col-xs-12" ] <|
                                [ h1 [ class "text-xs-center" ] [ text "Your Settings" ]
                                , ul [ class "error-messages" ]
                                    (List.map viewProblem model.problems)
                                , case model.status of
                                    Loaded form ->
                                        viewForm cred form

                                    Loading ->
                                        text ""

                                    LoadingSlowly ->
                                        Loading.icon

                                    Failed ->
                                        text "Error loading page."
                                ]
                            ]
                        ]
                    ]

            Nothing ->
                text "Sign in to view your settings."
    }



-- UPDATE


type Msg
    = SubmittedForm Cred Form
    | EnteredEmail String
    | EnteredUsername String
    | EnteredPassword String
    | EnteredBio String
    | EnteredAvatar String
    | CompletedFormLoad (Result Http.Error Form)
    | CompletedSave (Result Http.Error Viewer)
    | GotSession Session
    | PassedSlowLoadThreshold


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        CompletedFormLoad (Ok form) ->
            ( { model | status = Loaded form }
            , Cmd.none
            )

        CompletedFormLoad (Err _) ->
            ( { model | status = Failed }
            , Cmd.none
            )

        SubmittedForm cred form ->
            case validate form of
                Ok validForm ->
                    ( { model | status = Loaded form }
                    , edit cred validForm
                        |> Http.send CompletedSave
                    )

                Err problems ->
                    ( { model | problems = problems }
                    , Cmd.none
                    )

        EnteredEmail email ->
            updateForm (\form -> { form | email = email }) model

        EnteredUsername username ->
            updateForm (\form -> { form | username = username }) model

        EnteredPassword password ->
            updateForm (\form -> { form | password = password }) model

        EnteredBio bio ->
            updateForm (\form -> { form | bio = bio }) model

        EnteredAvatar avatar ->
            updateForm (\form -> { form | avatar = avatar }) model

        CompletedSave (Err error) ->
            let
                serverErrors =
                    Api.decodeErrors error
                        |> List.map ServerError
            in
            ( { model | problems = List.append model.problems serverErrors }
            , Cmd.none
            )

        CompletedSave (Ok viewer) ->
            ( model
            , Viewer.store viewer
            )

        GotSession session ->
            ( { model | session = session }
            , Route.replaceUrl (Session.navKey session) Route.Home
            )

        PassedSlowLoadThreshold ->
            case model.status of
                Loading ->
                    ( { model | status = LoadingSlowly }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )
