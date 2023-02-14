<?php
require_once 'access.php';

// Пример данных из формы, которые надо получить
$name = 'Имя клиента';
$phone = '+380123456789';
$email = 'email@gmail.com';
$target = 'Цель';
$company = 'Название компании';

$custom_field_id = 454021;
$custom_field_value = 'тест';

$ip = ''; //IP пользователя
$domain = $_SERVER['HTTP_HOST'];
$price = 0;
$pipeline_id = 5059931; //id воронки, его можно получить из url crm: Открываем раздел "Сделки", берем id открывшейся воронки (число в конце url), либо переключаемся на другую.
$user_amo = 0; //id пользователя, ответственного за сделку.

$utm_source   = '';
$utm_content  = '';
$utm_medium   = '';
$utm_campaign = '';
$utm_term     = '';
$utm_referrer = '';

$data = [
  [
    "name" => $phone,
    "price" => $price,
    "responsible_user_id" => (int) $user_amo,
    "pipeline_id" => (int) $pipeline_id,
    "_embedded" => [
      "metadata" => [
        "category" => "forms",
        "form_id" => 1,
        "form_name" => "Форма на сайте",
        "form_page" => $target,
        "form_sent_at" => strtotime(date("Y-m-d H:i:s")),
        "ip" => $ip,
        "referer" => $domain
      ],
      "contacts" => [
        [
          "first_name" => $name,
          "custom_fields_values" => [
            [
              "field_code" => "EMAIL",
              "values" => [
                [
                  "enum_code" => "WORK",
                  "value" => $email
                ]
              ]
            ],
            [
              "field_code" => "PHONE",
              "values" => [
                [
                  "enum_code" => "WORK",
                  "value" => $phone
                ]
              ]
            ],
            [
              "field_id" => (int) $custom_field_id,
              "values" => [
                [
                  "value" => $custom_field_value
                ]
              ]
            ]
          ]
        ]
      ],
      "companies" => [
        [
          "name" => $company
        ]
      ]
    ],
    "custom_fields_values" => [
      [
        "field_code" => 'UTM_SOURCE',
        "values" => [
          [
            "value" => $utm_source
          ]
        ]
      ],
      [
        "field_code" => 'UTM_CONTENT',
        "values" => [
          [
            "value" => $utm_content
          ]
        ]
      ],
      [
        "field_code" => 'UTM_MEDIUM',
        "values" => [
          [
            "value" => $utm_medium
          ]
        ]
      ],
      [
        "field_code" => 'UTM_CAMPAIGN',
        "values" => [
          [
            "value" => $utm_campaign
          ]
        ]
      ],
      [
        "field_code" => 'UTM_TERM',
        "values" => [
          [
            "value" => $utm_term
          ]
        ]
      ],
      [
        "field_code" => 'UTM_REFERRER',
        "values" => [
          [
            "value" => $utm_referrer
          ]
        ]
      ],
    ],
  ]
];

$method = "/api/v4/leads/complex";

$headers = [
  'Content-Type: application/json',
  'Authorization: Bearer ' . $access_token,
];

$curl = curl_init();
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
curl_setopt($curl, CURLOPT_URL, "https://" . $subdomain . ".amocrm.ru" . $method);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_COOKIEFILE, 'amo/pechenki.txt');
curl_setopt($curl, CURLOPT_COOKIEJAR, 'amo/pechenki.txt');
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
$out = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$code = (int) $code;
$errors = [
  301 => 'Moved permanently.',
  400 => 'Wrong structure of the array of transmitted data, or invalid identifiers of custom fields.',
  401 => 'Not Authorized. There is no account information on the server. You need to make a request to another server on the transmitted IP.',
  403 => 'The account is blocked, for repeatedly exceeding the number of requests per second.',
  404 => 'Not found.',
  500 => 'Internal server error.',
  502 => 'Bad gateway.',
  503 => 'Service unavailable.'
];

if ($code < 200 || $code > 204) die("Error $code. " . (isset($errors[$code]) ? $errors[$code] : 'Undefined error'));


$Response = json_decode($out, true);
$Response = $Response['_embedded']['items'];
$output = 'ID добавленных элементов списков:' . PHP_EOL;
foreach ($Response as $v)
  if (is_array($v))
    $output .= $v['id'] . PHP_EOL;
return $output;
